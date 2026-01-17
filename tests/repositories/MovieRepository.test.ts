import { MovieToAdd } from '../../src/models/Movie';
import { MovieRepository } from '../../src/repositories/MovieRepository';

describe('MovieRepository', () => {
    let repository: MovieRepository;
  
    beforeEach(() => {
      repository = new MovieRepository();
    });
  
    describe('save', () => {
      it('deve criar um novo filme com id', () => {
        const movieToAdd: MovieToAdd = {
          year: 2026,
          title: 'Piratas do Caribe',
          studios: 'Disney',
          winner: true,
          producerIds: [1]
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
          producerIds: []
        });
  
        const movie2 = repository.save({
          year: 2026,
          title: 'Piratas do Caribe 3',
          studios: 'Studio',
          winner: false,
          producerIds: []
        });
  
        expect(movie1.id).toBe(1);
        expect(movie2.id).toBe(2);
      });
    });
  
    describe('findById', () => {
      it('deve encontrar o filme por id', () => {
        const movie = repository.save({
          year: 2026,
          title: 'Piratas do Caribe',
          studios: 'Disney',
          winner: true,
          producerIds: [1]
        });
  
        const found = repository.findById(movie.id);
  
        expect(found).toBeDefined();
        expect(found?.id).toBe(movie.id);
        expect(found?.title).toBe('Piratas do Caribe');
      });
  
      it('deve retornar undefined quando não encontrar o id', () => {
        const found = repository.findById(999);
        expect(found).toBeUndefined();
      });
    });
  
    describe('findByWinner', () => {
      it('deve retornar somente os filmes que venceram', () => {
        repository.save({
          year: 2026,
          title: 'Piratas do Caribe vencedor',
          studios: 'Disney',
          winner: true,
          producerIds: [1]
        });
  
        repository.save({
          year: 2026,
          title: 'Piratas do Caribe perdedor',
          studios: 'Disney',
          winner: false,
          producerIds: [1]
        });
  
        const winners = repository.findByWinner(true);
        expect(winners).toHaveLength(1);
        expect(winners[0].title).toBe('Piratas do Caribe vencedor');
      });
    });
  
    describe('clear', () => {
      it('deve limpar todos os filmes e reiniciar o contador de id', () => {
        repository.save({
          year: 2026,
          title: 'Piratas do Caribe',
          studios: 'Disney',
          winner: false,
          producerIds: [1]
        });
  
        repository.clear();
  
        expect(repository.count()).toBe(0);
        
        const newMovie = repository.save({
          year: 2026,
          title: 'Piratas do Caribe: o recomeço',
          studios: 'Disney',
          winner: false,
          producerIds: [1]
        });
  
        expect(newMovie.id).toBe(1);
      });
    });
  });