import Database from 'better-sqlite3';
import { Movie, MovieToAdd } from '../models/Movie';

export class MovieRepository {
    private db: Database.Database;

    constructor(database: Database.Database) {
        this.db = database;
    }
    save(movieToAdd: MovieToAdd): Movie {
        const stmt = this.db.prepare(`
            INSERT INTO movies (year, title, studios, winner)
            VALUES (?, ?, ?, ?)
        `);

        const result = stmt.run(
            movieToAdd.year,
            movieToAdd.title,
            movieToAdd.studios,
            movieToAdd.winner ? 1 : 0
        );

        const movieId = result.lastInsertRowid as number;

        const movie: Movie = {
            id: movieId,
            ...movieToAdd,
        };
        this.insertMovieProducers(movieId, movieToAdd.producerIds);

        return movie;
    }

    private insertMovieProducers(movieId: number, producerIds: number[]): void {
        const stmt = this.db.prepare(`
            INSERT INTO movie_producers (movie_id, producer_id)
            VALUES (?, ?)
        `);

        for (const producerId of producerIds) {
            stmt.run(movieId, producerId);
        }
    }

    findAll(): Movie[] {
        const rows = this.db.prepare('SELECT * FROM movies').all() as Array<{
            id: number;
            year: number;
            title: string;
            studios: string;
            winner: number;
        }>;

        return rows.map(row => this.mapRowToMovie(row));
    }

    findById(id: number): Movie | undefined {
        const row = this.db.prepare('SELECT * FROM movies WHERE id = ?').get(id) as
            | {
                  id: number;
                  year: number;
                  title: string;
                  studios: string;
                  winner: number;
              }
            | undefined;

        if (!row) {
            return undefined;
        }

        return this.mapRowToMovie(row);
    }

    findByWinner(winner: boolean): Movie[] {
        const rows = this.db
            .prepare('SELECT * FROM movies WHERE winner = ?')
            .all(winner ? 1 : 0) as Array<{
            id: number;
            year: number;
            title: string;
            studios: string;
            winner: number;
        }>;

        return rows.map(row => this.mapRowToMovie(row));
    }

    findByYear(year: number): Movie[] {
        const rows = this.db.prepare('SELECT * FROM movies WHERE year = ?').all(year) as Array<{
            id: number;
            year: number;
            title: string;
            studios: string;
            winner: number;
        }>;

        return rows.map(row => this.mapRowToMovie(row));
    }

    count(): number {
        const result = this.db.prepare('SELECT COUNT(*) as count FROM movies').get() as {
            count: number;
        };
        return result.count;
    }

    clear(): void {
        this.db.prepare('DELETE FROM movies').run();
    }

    private mapRowToMovie(row: {
        id: number;
        year: number;
        title: string;
        studios: string;
        winner: number;
    }): Movie {
        const producerIds = this.getProducerIdsForMovie(row.id);

        return {
            id: row.id,
            year: row.year,
            title: row.title,
            studios: row.studios,
            winner: row.winner === 1,
            producerIds,
        };
    }

    private getProducerIdsForMovie(movieId: number): number[] {
        const rows = this.db
            .prepare('SELECT producer_id FROM movie_producers WHERE movie_id = ?')
            .all(movieId) as Array<{ producer_id: number }>;

        return rows.map(row => row.producer_id);
    }
}
