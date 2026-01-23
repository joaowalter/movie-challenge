import { DataLoader } from '../../src/utils/DataLoader';
import fs from 'fs';
import path from 'path';

describe('DataLoader', () => {
    let dataLoader: DataLoader | null = null;

    afterEach(() => {
        if (dataLoader) {
            dataLoader.close();
            dataLoader = null;
        }
    });

    it('deve carregar os dados corretamente do csv', () => {
        const filePath = path.resolve('Movielist.csv');

        if (!fs.existsSync(filePath)) {
            console.warn('Arquivo não encontrado, pulando esse teste.');
            return;
        }

        dataLoader = new DataLoader();
        dataLoader.loadDataFromCsv();

        const { movieRepository, producerRepository } = dataLoader.getRepositories();

        expect(movieRepository.count()).toBeGreaterThan(0);
        expect(producerRepository.count()).toBeGreaterThan(0);
    });

    it('deve poder verificar os repositórios após load', () => {
        dataLoader = new DataLoader();
        const { movieRepository, producerRepository } = dataLoader.getRepositories();

        expect(movieRepository.count()).toBe(0);
        expect(producerRepository.count()).toBe(0);
    });
});
