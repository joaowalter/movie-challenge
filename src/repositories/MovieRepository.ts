import { Movie, MovieToAdd } from '../models/Movie';

export class MovieRepository {
    private movies: Map<number, Movie> = new Map();
    private nextId = 1;

    save(movieToAdd: MovieToAdd): Movie {
        const movie: Movie = {
            id: this.nextId++,
            ...movieToAdd,
        };
        this.movies.set(movie.id, movie);
        return movie;
    }

    findAll(): Movie[] {
        return Array.from(this.movies.values());
    }

    findById(id: number): Movie | undefined {
        return this.movies.get(id);
    }

    findByWinner(winner: boolean): Movie[] {
        return Array.from(this.movies.values())
          .filter(m => m.winner === winner);
    }

    findByYear(year: number): Movie[] {
        return Array.from(this.movies.values())
          .filter(m => m.year === year);
    }

    count(): number {
        return this.movies.size;
    }

    clear(): void {
        this.movies.clear();
        this.nextId = 1;
    }
}
