import { Producer, ProducerToAdd } from '../models/Producer';

export class ProducerRepository {
    private producers: Map<number, Producer> = new Map();
    private producersNames: Map<string, Producer> = new Map();
    private nextId = 1;

    private normalizeName(name: string): string {
        return name.trim().toLowerCase();
    }

    save(producerToAdd: ProducerToAdd): Producer {
        const normalizedName = this.normalizeName(producerToAdd.name);

        const existProducerName = this.producersNames.get(normalizedName);

        if (existProducerName) {
            return existProducerName;
        }

        const producer: Producer = {
            id: this.nextId++,
            name: producerToAdd.name,
            movieIds: [],
        };

        this.producers.set(producer.id, producer);
        this.producersNames.set(normalizedName, producer);

        return producer;
        
    }

    findAll(): Producer[] {
        return Array.from(this.producers.values());
    }
        
    findById(id: number): Producer | undefined {
        return this.producers.get(id);
    }

    findByName(name: string): Producer | undefined {
        const normalizedName = this.normalizeName(name);
        return this.producersNames.get(normalizedName);
    }

    addMovie(producerId: number, movieId: number): void {
        const producer = this.producers.get(producerId);
        if (producer && !producer.movieIds.includes(movieId)) {
            producer.movieIds.push(movieId);
          }
    }

    removeMovie(producerId: number, movieId: number): void {
        const producer = this.producers.get(producerId);
        if (producer) {
            producer.movieIds = producer.movieIds.filter(id => id !== movieId);
        }
    }

    count(): number {
        return this.producers.size;
    }

    clear(): void {
        this.producers.clear();
        this.producersNames.clear();
        this.nextId = 1;
    }  
    
}
