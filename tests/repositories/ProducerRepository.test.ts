import { ProducerRepository } from '../../src/repositories/ProducerRepository';
import { MovieRepository } from '../../src/repositories/MovieRepository';
import { ProducerToAdd } from '../../src/models/Producer';
import { DatabaseMemory } from '../../src/database/Database';

describe('ProducerRepository', () => {
    let repository: ProducerRepository;
    let movieRepository: MovieRepository;
    let database: DatabaseMemory;

    beforeEach(() => {
        database = new DatabaseMemory();
        repository = new ProducerRepository(database.getDatabase());
        movieRepository = new MovieRepository(database.getDatabase());
    });

    afterEach(() => {
        database.close();
    });

    describe('save', () => {
        it('deve criar um novo produtor com id', () => {
            const producerToAdd: ProducerToAdd = {
                name: 'Jerry Bruckheimer',
            };

            const producer = repository.save(producerToAdd);

            expect(producer.id).toBe(1);
            expect(producer.name).toBe('Jerry Bruckheimer');
            expect(producer.movieIds).toEqual([]);
        });

        it('deve evitar registros duplicados independente do case', () => {
            const producer1 = repository.save({ name: 'Jerry Bruckheimer' });
            const producer2 = repository.save({ name: 'jerry bruckheimer' });
            const producer3 = repository.save({ name: '  Jerry Bruckheimer  ' });

            expect(producer1.id).toBe(producer2.id);
            expect(producer2.id).toBe(producer3.id);
            expect(repository.count()).toBe(1);
        });
    });

    describe('findByName', () => {
        it('deve encontrar produtor pelo nome independente do case', () => {
            repository.save({ name: 'Jerry Bruckheimer' });

            const found1 = repository.findByName('Jerry Bruckheimer');
            const found2 = repository.findByName('jerry bruckheimer');
            const found3 = repository.findByName('  JERRY BRUCKHEIMER  ');

            expect(found1).toBeDefined();
            expect(found1?.id).toBe(found2?.id);
            expect(found2?.id).toBe(found3?.id);
        });

        it('ddeve retornar undefined quando não encontrar o id', () => {
            const found = repository.findByName('Piratas do Caribe: o filme que não existe');
            expect(found).toBeUndefined();
        });
    });

    describe('addMovie', () => {
        it('deve adicionar filme ao produtor', () => {
            const producer = repository.save({ name: 'Jerry Bruckheimer' });
            const movie = movieRepository.save({
                year: 2026,
                title: 'Piratas do Caribe',
                studios: 'Disney',
                winner: true,
                producerIds: [],
            });
            repository.addMovie(producer.id, movie.id);

            const updated = repository.findById(producer.id);
            expect(updated?.movieIds).toContain(movie.id);
        });

        it('não deve adicionar o mesmo filme duplicado', () => {
            const producer = repository.save({ name: 'Jerry Bruckheimer' });
            const movie = movieRepository.save({
                year: 2026,
                title: 'Piratas do Caribe',
                studios: 'Disney',
                winner: true,
                producerIds: [],
            });
            repository.addMovie(producer.id, movie.id);
            repository.addMovie(producer.id, movie.id);

            const updated = repository.findById(producer.id);
            expect(updated?.movieIds.filter(id => id === movie.id)).toHaveLength(1);
        });
    });

    describe('clear', () => {
        it('deve limpar todos os produtores', () => {
            repository.save({ name: 'Jerry Bruckheimer' });
            repository.clear();

            expect(repository.count()).toBe(0);

            const newProducer = repository.save({ name: 'Jerry Bruckheimer: o recomeço' });
            expect(newProducer.id).toBeGreaterThan(0);
            expect(newProducer.name).toBe('Jerry Bruckheimer: o recomeço');
        });
    });
});
