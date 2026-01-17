import { CsvLoaderService } from '../../src/services/CsvLoaderService';
import { MovieRepository } from '../../src/repositories/MovieRepository';
import { ProducerRepository } from '../../src/repositories/ProducerRepository';
import fs from 'fs';
import path from 'path';

describe('CsvLoaderService', () => {
    let csvLoaderService: CsvLoaderService;
    let movieRepository: MovieRepository;
    let producerRepository: ProducerRepository;

    beforeEach(() => {
        movieRepository = new MovieRepository();
        producerRepository = new ProducerRepository();
        csvLoaderService = new CsvLoaderService(movieRepository, producerRepository);
    });

    describe('loadMoviesFromCsv', () => {
        it('deve carregar os dados corretamente do csv', () => {
            const filePath = path.resolve('Movielist.csv');

            if(!fs.existsSync(filePath)){
                throw new Error(`Arquivo não encontrado, pulando esse teste.`);
                return;
            }

            csvLoaderService.loadMoviesFromCsv(filePath);

            expect(movieRepository.count()).toBeGreaterThan(0);
            expect(producerRepository.count()).toBeGreaterThan(0);
        });

        it('deve dar erro se o arquivo não for encontrado', () => {
            expect(() => {
                csvLoaderService.loadMoviesFromCsv('testetestetstetset.csv');
            }).toThrow();
        });
    });

    describe('parseWinner', () => {
        it('deve ser winner quando o valor for "yes"', () => {

            const csvContent = `year;title;studios;producers;winner
            2026;Piratas do Caribe;Disney;Jerry Bruckheimer;yes`;

            const pathTemporaryFile = path.resolve('temp-test.csv');
            fs.writeFileSync(pathTemporaryFile, csvContent, 'utf-8');

            csvLoaderService.loadMoviesFromCsv(pathTemporaryFile);

            const winners = movieRepository.findByWinner(true);
            expect(winners).toHaveLength(1);
            expect(winners[0].title).toBe('Piratas do Caribe');

            fs.unlinkSync(pathTemporaryFile);
        });

        it('deve ser winner quando o valor for "no"', () => {

            const csvContent = `year;title;studios;producers;winner
            2026;Piratas do Caribe;Disney;Jerry Bruckheimer;no`;

            const pathTemporaryFile = path.resolve('temp-test.csv');
            fs.writeFileSync(pathTemporaryFile, csvContent, 'utf-8');

            csvLoaderService.loadMoviesFromCsv(pathTemporaryFile);

            const losers = movieRepository.findByWinner(false);
            expect(losers).toHaveLength(1);
            expect(losers[0].title).toBe('Piratas do Caribe');

            fs.unlinkSync(pathTemporaryFile);
        });

        it('deve ser loser quando o valor for vazio', () => {

            const csvContent = `year;title;studios;producers;winner
            2026;Piratas do Caribe;Disney;Jerry Bruckheimer;`;

            const pathTemporaryFile = path.resolve('temp-test.csv');
            fs.writeFileSync(pathTemporaryFile, csvContent, 'utf-8');

            csvLoaderService.loadMoviesFromCsv(pathTemporaryFile);

            const winners = movieRepository.findByWinner(true);
            const losers = movieRepository.findByWinner(false);

            expect(winners).toHaveLength(0);
            expect(losers).toHaveLength(1);
            expect(losers[0].title).toBe('Piratas do Caribe');
            fs.unlinkSync(pathTemporaryFile);
        });
    });
});
