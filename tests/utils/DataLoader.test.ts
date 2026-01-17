import { DataLoader } from '../../src/utils/DataLoader';
import fs from 'fs';
import path from 'path';

describe('DataLoader', () => {
    it('deve carregar os dados corretamente do csv', () => {
        const filePath = path.resolve('Movielist.csv');

        if(!fs.existsSync(filePath)){
            console.warn('Arquivo não encontrado, pulando esse teste.');
            return;
        };

        const dataLoader = new DataLoader();
        dataLoader.loadDataFromCsv();

        const { movieRepository, producerRepository } = dataLoader.getRepositories();

        expect(movieRepository.count()).toBeGreaterThan(0);
        expect(producerRepository.count()).toBeGreaterThan(0);
        
    });

    it('deve poder verificar os repositórios após load', () => {
        const dataLoader = new DataLoader();
        const {movieRepository, producerRepository} = dataLoader.getRepositories();

        expect(movieRepository.count()).toBe(0);
        expect(producerRepository.count()).toBe(0);
    });
});