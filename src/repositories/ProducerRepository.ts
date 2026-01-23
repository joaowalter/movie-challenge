import Database from 'better-sqlite3';
import { Producer, ProducerToAdd } from '../models/Producer';

export class ProducerRepository {
    private db: Database.Database;

    constructor(database: Database.Database) {
        this.db = database;
    }

    private normalizeName(name: string): string {
        return name.trim().toLowerCase();
    }

    save(producerToAdd: ProducerToAdd): Producer {
        const existing = this.findByName(producerToAdd.name);
        if (existing) {
            return existing;
        }

        const stmt = this.db.prepare('INSERT INTO producers (name) VALUES (?)');
        const result = stmt.run(producerToAdd.name);
        const producerId = result.lastInsertRowid as number;

        const movieIds = this.getMovieIdsForProducer(producerId);

        return {
            id: producerId,
            name: producerToAdd.name,
            movieIds,
        };
    }

    findAll(): Producer[] {
        const rows = this.db.prepare('SELECT * FROM producers').all() as Array<{
            id: number;
            name: string;
        }>;

        return rows.map(row => this.mapRowToProducer(row));
    }

    findById(id: number): Producer | undefined {
        const row = this.db.prepare('SELECT * FROM producers WHERE id = ?').get(id) as
            | {
                  id: number;
                  name: string;
              }
            | undefined;

        if (!row) {
            return undefined;
        }

        return this.mapRowToProducer(row);
    }

    findByName(name: string): Producer | undefined {
        const normalizedName = this.normalizeName(name);

        const row = this.db
            .prepare('SELECT * FROM producers WHERE LOWER(TRIM(name)) = ?')
            .get(normalizedName) as
            | {
                  id: number;
                  name: string;
              }
            | undefined;

        if (!row) {
            return undefined;
        }

        return this.mapRowToProducer(row);
    }

    addMovie(producerId: number, movieId: number): void {
        const existing = this.db
            .prepare('SELECT 1 FROM movie_producers WHERE movie_id = ? AND producer_id = ?')
            .get(movieId, producerId);

        if (!existing) {
            this.db
                .prepare('INSERT INTO movie_producers (movie_id, producer_id) VALUES (?, ?)')
                .run(movieId, producerId);
        }
    }

    removeMovie(producerId: number, movieId: number): void {
        this.db
            .prepare('DELETE FROM movie_producers WHERE movie_id = ? AND producer_id = ?')
            .run(movieId, producerId);
    }

    count(): number {
        const result = this.db.prepare('SELECT COUNT(*) as count FROM producers').get() as {
            count: number;
        };
        return result.count;
    }

    clear(): void {
        this.db.prepare('DELETE FROM producers').run();
    }

    private mapRowToProducer(row: { id: number; name: string }): Producer {
        const movieIds = this.getMovieIdsForProducer(row.id);

        return {
            id: row.id,
            name: row.name,
            movieIds,
        };
    }

    private getMovieIdsForProducer(producerId: number): number[] {
        const rows = this.db
            .prepare('SELECT movie_id FROM movie_producers WHERE producer_id = ?')
            .all(producerId) as Array<{ movie_id: number }>;

        return rows.map(row => row.movie_id);
    }
}
