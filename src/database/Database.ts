import Database from 'better-sqlite3';

export class DatabaseMemory {
    private db: Database.Database;

    constructor() {
        this.db = new Database(':memory:');

        this.createTables();
    }

    private createTables(): void {
        this.db.exec(`
            CREATE TABLE movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                year INTEGER NOT NULL,
                title TEXT NOT NULL,
                studios TEXT,
                winner BOOLEAN NOT NULL DEFAULT 0
            );

            CREATE TABLE producers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );

            CREATE TABLE movie_producers (
                movie_id INTEGER NOT NULL,
                producer_id INTEGER NOT NULL,
                PRIMARY KEY (movie_id, producer_id),
                FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
                FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE CASCADE
            );
        `);
    }

    getDatabase(): Database.Database {
        return this.db;
    }

    close(): void {
        this.db.close();
    }
}
