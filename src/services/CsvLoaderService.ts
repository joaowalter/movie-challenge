import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { MovieRepository } from '../repositories/MovieRepository';
import { ProducerRepository } from '../repositories/ProducerRepository';
import {MovieToAdd} from '../models/Movie';

export class CsvLoaderService {
    constructor(private movieRepository: MovieRepository, private producerRepository: ProducerRepository) {}

    loadMoviesFromCsv(filePath: string = 'Movielist.csv'): void {
        try{
            const originalPath = path.resolve(filePath);

            if(!fs.existsSync(originalPath)){
                throw new Error(`Arquivo ${filePath} não encontrado`);
        }

        const contentFile = fs.readFileSync(originalPath, 'utf8');

        const dataFile = parse(contentFile, {
            delimiter: ';',
            columns: true,
            skip_empty_lines: true,
            trim: true,
            relax_column_count: true,
        });

        let count = 0;
        let errorCount = 0;

        for (let i=0; i < dataFile.length; i++){
            try{
                const movie = this.parseData(dataFile[i], i + 2);

                if (movie){
                  const newMovieSaved = this.movieRepository.save(movie);

                  for (const producerId of movie.producerIds){
                    this.producerRepository.addMovie(producerId, newMovieSaved.id);
                  }

                    count++;
                } else {
                    console.error(`Erro na linha ${i + 2}:`, dataFile[i]);
                    errorCount++;
                }
            } catch (error) {
                errorCount++;
                console.error(`Erro ao processar linha ${i + 2}:`, error);
            }
        }

        console.log(`Csv carregado ${count} sucesso(s) e ${errorCount} erro(s)`);
    } catch (error) {
        console.error('Erro ao carregar csv:', error);
        throw new Error(`Falhou ao carregar arquivo csv: ${error}`);
      }
    }

    private parseYear(yearInString: string): number | null {
        try {
          const year = parseInt(yearInString.trim(), 10);
          
          if (isNaN(year) || year < 1895 || year > new Date().getFullYear()) {
            console.warn(`Ano inválido ${yearInString} o primeiro filme foi em 1895, e não pode ser maior que o ano atual.`);
            return null;
          }
          
          return year;
        } catch (error) {
          console.warn(`Erro no parseYear do ano ${yearInString}`, error);
          return null;
        }
      }

      private parseWinner(winnerInString: string | undefined): boolean {
        if (!winnerInString) {
          return false;
        }
        
        return winnerInString.toLowerCase().trim() === 'yes';
      }

      private parseProducers(producersInString: string): string[] {
        if (!producersInString || producersInString.trim().length === 0) {
          return [];
        }
    
        const producersInArray = producersInString
          .split(/,| and /i)
          .map(p => p.trim())
          .filter(p => p.length > 0);
    
        return producersInArray;
      }

    private parseData(singleData: any, line: number): MovieToAdd | null {
        if (!singleData.year || !singleData.title) {
          console.warn(`Linha ${line} está sem o year ou title`);
          return null;
        }
    
        const year = this.parseYear(singleData.year);
        if (!year) {
          return null;
        }
        const winner = this.parseWinner(singleData.winner);
    
        const producerNames = this.parseProducers(singleData.producers || '');
        if (producerNames.length === 0) {
          console.warn(`Linha ${line} sem nenhum produtor`);
          return null;
        }

        const producerIds: number[] = [];
        for (const producerName of producerNames) {
          let producer = this.producerRepository.findByName(producerName);
          
          if (!producer) {
            producer = this.producerRepository.save({ name: producerName });
          }
          
          producerIds.push(producer.id);
        }
    
        const movieToAdd: MovieToAdd = {
          year,
          title: singleData.title.trim(),
          studios: (singleData.studios || '').trim(),
          winner,
          producerIds
        };
    
        return movieToAdd;
      }
}