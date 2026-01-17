import { MovieRepository } from '../repositories/MovieRepository';
import { ProducerRepository } from '../repositories/ProducerRepository';
import { CsvLoaderService } from '../services/CsvLoaderService';
import path from 'path';

export class DataLoader {
    private movieRepository: MovieRepository;
    private producerRepository: ProducerRepository;
    private csvLoaderService: CsvLoaderService;

    constructor() {
        this.movieRepository = new MovieRepository();
        this.producerRepository = new ProducerRepository();
        this.csvLoaderService = new CsvLoaderService(this.movieRepository, this.producerRepository);
    }

    loadDataFromCsv(filePath?: string): void {
        try {
            const originalPath = filePath || path.resolve('Movielist.csv');

            this.csvLoaderService.loadMoviesFromCsv(originalPath);
            console.log('Dados carregados');
        } catch (error) {
            console.error('Erro ao carregar dados', error);
            throw new Error(`Falha ao carregar dados do Csv: ${error}`);
        }
    }

    getRepositories() {
        return {
          movieRepository: this.movieRepository,
          producerRepository: this.producerRepository
        };
      }
    }