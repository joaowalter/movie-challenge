import { AwardService } from '../../src/services/AwardService';
import { MovieRepository } from '../../src/repositories/MovieRepository';
import { ProducerRepository } from '../../src/repositories/ProducerRepository';
import { DatabaseMemory } from '../../src/database/Database';

describe('AwardService', () => {
    let awardService: AwardService;
    let movieRepository: MovieRepository;
    let producerRepository: ProducerRepository;
    let database: DatabaseMemory;

    beforeEach(() => {
        database = new DatabaseMemory();
        movieRepository = new MovieRepository(database.getDatabase());
        producerRepository = new ProducerRepository(database.getDatabase());
        awardService = new AwardService(movieRepository, producerRepository);
    });

    afterEach(() => {
        database.close();
    });

    describe('getAwardIntervals', () => {
        it('deve retornar intervalos vazios se não houver vencedores', () => {
            const result = awardService.getAwardIntervals();

            expect(result.min).toEqual([]);
            expect(result.max).toEqual([]);
        });

        it('deve retornar intervalos vazios quando não há produtores com mais de 2 prêmios', () => {
            const producer = producerRepository.save({ name: 'Jerry Bruckheimer' });

            movieRepository.save({
                year: 2026,
                title: 'Piratas do Caribe',
                studios: 'Disney',
                winner: true,
                producerIds: [producer.id],
            });

            const result = awardService.getAwardIntervals();

            expect(result.min).toEqual([]);
            expect(result.max).toEqual([]);
        });

        it('deve retornar intervalos corretos para um produtor com mais de 2 prêmios', () => {
            const producer = producerRepository.save({ name: 'Jerry Bruckheimer' });

            const movie1 = movieRepository.save({
                year: 2025,
                title: 'Piratas do Caribe',
                studios: 'Disney',
                winner: true,
                producerIds: [producer.id],
            });

            const movie2 = movieRepository.save({
                year: 2026,
                title: 'Piratas do Caribe 2',
                studios: 'Disney',
                winner: true,
                producerIds: [producer.id],
            });

            producerRepository.addMovie(producer.id, movie1.id);
            producerRepository.addMovie(producer.id, movie2.id);

            const result = awardService.getAwardIntervals();

            expect(result.min).toHaveLength(1);
            expect(result.min[0].producer).toBe('Jerry Bruckheimer');
            expect(result.min[0].interval).toBe(1);
            expect(result.min[0].previousWin).toBe(2025);
            expect(result.min[0].followingWin).toBe(2026);
            expect(result.max).toHaveLength(1);
            expect(result.max[0].interval).toBe(1);
        });

        it('deve calcular intervalos corretos para produtores com mais de 2 prêmios', () => {
            const producer = producerRepository.save({ name: 'Jerry Bruckheimer' });

            const movie1 = movieRepository.save({
                year: 2008,
                title: 'Piratas do Caribe',
                studios: 'Disney',
                winner: true,
                producerIds: [producer.id],
            });

            const movie2 = movieRepository.save({
                year: 2010,
                title: 'Piratas do Caribe 2',
                studios: 'Disney',
                winner: true,
                producerIds: [producer.id],
            });

            const movie3 = movieRepository.save({
                year: 2015,
                title: 'Piratas do Caribe 3',
                studios: 'Disney',
                winner: true,
                producerIds: [producer.id],
            });

            producerRepository.addMovie(producer.id, movie1.id);
            producerRepository.addMovie(producer.id, movie2.id);
            producerRepository.addMovie(producer.id, movie3.id);

            const result = awardService.getAwardIntervals();

            expect(result.min).toHaveLength(1);
            expect(result.min[0].interval).toBe(2);
            expect(result.min[0].previousWin).toBe(2008);
            expect(result.min[0].followingWin).toBe(2010);
            expect(result.max).toHaveLength(1);
            expect(result.max[0].interval).toBe(5);
            expect(result.max[0].previousWin).toBe(2010);
            expect(result.max[0].followingWin).toBe(2015);
        });

        it('deve retornar multiplos produtores com intervalos minimos iguais', () => {
            const producer1 = producerRepository.save({ name: 'Jerry Bruckheimer' });
            const producer2 = producerRepository.save({ name: 'Steven Spielberg' });

            const movie1a = movieRepository.save({
                year: 2008,
                title: 'Piratas do Caribe',
                studios: 'Disney',
                winner: true,
                producerIds: [producer1.id],
            });

            const movie2a = movieRepository.save({
                year: 2010,
                title: 'Piratas do Caribe 2',
                studios: 'Disney',
                winner: true,
                producerIds: [producer1.id],
            });

            const movie1b = movieRepository.save({
                year: 2008,
                title: 'Jurassic Park',
                studios: 'Universal',
                winner: true,
                producerIds: [producer2.id],
            });

            const movie2b = movieRepository.save({
                year: 2010,
                title: 'Jurassic Park 2',
                studios: 'Universal',
                winner: true,
                producerIds: [producer2.id],
            });

            producerRepository.addMovie(producer1.id, movie1a.id);
            producerRepository.addMovie(producer1.id, movie2a.id);
            producerRepository.addMovie(producer2.id, movie1b.id);
            producerRepository.addMovie(producer2.id, movie2b.id);

            const result = awardService.getAwardIntervals();

            expect(result.min).toHaveLength(2);
            expect(result.min.map(i => i.producer)).toContain('Jerry Bruckheimer');
            expect(result.min.map(i => i.producer)).toContain('Steven Spielberg');
            expect(result.min.every(i => i.interval === 2)).toBe(true);
        });
    });
});
