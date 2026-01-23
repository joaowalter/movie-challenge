import { MovieRepository } from '../repositories/MovieRepository';
import { ProducerRepository } from '../repositories/ProducerRepository';
import { AwardResponse, Interval } from '../models/AwardResponse';
import { Movie } from '../models/Movie';

export class AwardService {
    constructor(
        private movieRepository: MovieRepository,
        private producerRepository: ProducerRepository
    ) {}

    getAwardIntervals(): AwardResponse {
        const winners = this.movieRepository.findByWinner(true);

        if (winners.length === 0) {
            return { min: [], max: [] };
        }

        const producerYears = this.winnersByProducer(winners);

        const minInterval = this.calculateMinInterval(producerYears);
        const maxInterval = this.calculateMaxInterval(producerYears);

        if (minInterval.length === 0 && maxInterval.length === 0) {
            return { min: [], max: [] };
        }

        return { min: minInterval, max: maxInterval };
    }

    private winnersByProducer(winners: Movie[]): Map<number, number[]> {
        const producerYearsMap = new Map<number, number[]>();

        for (const movie of winners) {
            for (const producerId of movie.producerIds) {
                if (!producerYearsMap.has(producerId)) {
                    producerYearsMap.set(producerId, []);
                }

                producerYearsMap.get(producerId)!.push(movie.year);
            }
        }

        for (const [, years] of producerYearsMap.entries()) {
            years.sort((a, b) => a - b);
        }

        return producerYearsMap;
    }

    private calculateMinInterval(producerYears: Map<number, number[]>): Interval[] {
        const allIntervals: Interval[] = [];
        for (const [producerId, years] of producerYears.entries()) {
            if (years.length < 2) {
                continue;
            }

            const producer = this.producerRepository.findById(producerId);
            if (!producer) {
                continue;
            }

            for (let i = 0; i < years.length - 1; i++) {
                const previousWin = years[i];
                const followingWin = years[i + 1];
                const interval = followingWin - previousWin;

                allIntervals.push({
                    producer: producer.name,
                    interval,
                    previousWin,
                    followingWin,
                });
            }
        }

        if (allIntervals.length === 0) {
            return [];
        }

        const minIntervalValue = Math.min(...allIntervals.map(i => i.interval));

        return allIntervals.filter(i => i.interval === minIntervalValue);
    }

    private calculateMaxInterval(producerYears: Map<number, number[]>): Interval[] {
        const allIntervals: Interval[] = [];

        for (const [producerId, years] of producerYears.entries()) {
            if (years.length < 2) {
                continue;
            }

            const producer = this.producerRepository.findById(producerId);
            if (!producer) {
                continue;
            }

            for (let i = 0; i < years.length - 1; i++) {
                const previousWin = years[i];
                const followingWin = years[i + 1];
                const interval = followingWin - previousWin;

                allIntervals.push({
                    producer: producer.name,
                    interval,
                    previousWin,
                    followingWin,
                });
            }
        }

        if (allIntervals.length === 0) {
            return [];
        }

        const maxIntervalValue = Math.max(...allIntervals.map(i => i.interval));

        return allIntervals.filter(i => i.interval === maxIntervalValue);
    }
}
