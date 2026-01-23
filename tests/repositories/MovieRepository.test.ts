import { MovieToAdd } from '../../src/models/Movie';
import { MovieRepository } from '../../src/repositories/MovieRepository';
import { ProducerRepository } from '../../src/repositories/ProducerRepository';
import { DatabaseMemory } from '../../src/database/Database';

describe('MovieRepository', () => {
    let repository: MovieRepository;
    let producerRepository: ProducerRepository;
    let database: DatabaseMemory;

    beforeEach(() => {
        database = new DatabaseMemory();
        repository = new MovieRepository(database.getDatabase());
        producerRepository = new ProducerRepository(database.getDatabase());
    });

    afterEach(() => {
        database.close();
    });

    describe('save', () => {
        it('deve criar um novo filme com id', () => {
            const producer = producerRepository.save({ name: 'Jerry Bruckheimer' });
            const movieToAdd: MovieToAdd = {
                year: 2026,
                title: 'Piratas do Caribe',
                studios: 'Disney',
                winner: true,
                producerIds: [producer.id],
            };

            const movie = repository.save(movieToAdd);

            expect(movie.id).toBe(1);
            expect(movie.title).toBe('Piratas do Caribe');
            expect(movie.year).toBe(2026);
        });

        it('deve gerar ids crescentes', () => {
            const movie1 = repository.save({
                year: 2026,
                title: 'Piratas do Caribe 2',
                studios: 'Studio',
                winner: false,
                producerIds: [],
            });

            const movie2 = repository.save({
                year: 2026,
                title: 'Piratas do Caribe 3',
                studios: 'Studio',
                winner: false,
                producerIds: [],
            });

            expect(movie1.id).toBe(1);
            expect(movie2.id).toBe(2);
        });
    });

    describe('findById', () => {
        it('deve encontrar o filme por id', () => {
            const producer = producerRepository.save({ name: 'Jerry Bruckheimer' });
            const movie = repository.save({
                year: 2026,
                title: 'Piratas do Caribe',
                studios: 'Disney',
                winner: true,
                producerIds: [producer.id],
            });

            const found = repository.findById(movie.id);

            expect(found).toBeDefined();
            expect(found?.id).toBe(movie.id);
            expect(found?.title).toBe('Piratas do Caribe');
        });
    });

    describe('findByWinner', () => {
        it('deve retornar somente os filmes que venceram', () => {
            const producer = producerRepository.save({ name: 'Jerry Bruckheimer' });
            repository.save({
                year: 2026,
                title: 'Piratas do Caribe vencedor',
                studios: 'Disney',
                winner: true,
                producerIds: [producer.id],
            });

            repository.save({
                year: 2026,
                title: 'Piratas do Caribe perdedor',
                studios: 'Disney',
                winner: false,
                producerIds: [producer.id],
            });

            const winners = repository.findByWinner(true);
            expect(winners).toHaveLength(1);
            expect(winners[0].title).toBe('Piratas do Caribe vencedor');
        });
    });

    describe('clear', () => {
        it('deve limpar todos os filmes', () => {
            const producer = producerRepository.save({ name: 'Jerry Bruckheimer' });
            repository.save({
                year: 2026,
                title: 'Piratas do Caribe',
                studios: 'Disney',
                winner: false,
                producerIds: [producer.id],
            });

            repository.clear();

            expect(repository.count()).toBe(0);
        });
    });
});
