import request from 'supertest';
import app from '../../src/app';
import { Interval } from '../../src/models/AwardResponse';

describe('AwardController CSV Data', () => {
    describe('GET /api/awards/award-intervals com dados do csv', () => {
        it('deve retornar 200 com dados válidos', async () => {
            const response = await request(app).get('/api/awards/award-intervals').expect(200);

            expect(response.body).toHaveProperty('min');
            expect(response.body).toHaveProperty('max');
            expect(response.body.min).toBeInstanceOf(Array);
            expect(response.body.max).toBeInstanceOf(Array);

            if (response.body.min.length > 0 && response.body.max.length > 0) {
                const min = response.body.min[0];
                const max = response.body.max[0];

                expect(min).toHaveProperty('producer');
                expect(min).toHaveProperty('interval');
                expect(min).toHaveProperty('previousWin');
                expect(min).toHaveProperty('followingWin');

                expect(max).toHaveProperty('producer');
                expect(max).toHaveProperty('interval');
                expect(max).toHaveProperty('previousWin');
                expect(max).toHaveProperty('followingWin');
            }
        });

        it('valida se min é menor que max', async () => {
            const response = await request(app).get('/api/awards/award-intervals').expect(200);

            if (response.body.min.length > 0 && response.body.max.length > 0) {
                const minInterval = response.body.min[0].interval;
                const maxInterval = response.body.max[0].interval;
                expect(minInterval).toBeLessThanOrEqual(maxInterval);
            }
        });

        it('deve retornar valores específicos do csv, valida que o resultado não mudou com snapshot', async () => {
            const response = await request(app).get('/api/awards/award-intervals').expect(200);

            expect(response.body.min.length).toBeGreaterThan(0);
            expect(response.body.max.length).toBeGreaterThan(0);

            const minIntervalValue = response.body.min[0].interval;
            response.body.min.forEach((interval: Interval) => {
                expect(interval.interval).toBe(minIntervalValue);
                expect(interval.followingWin - interval.previousWin).toBe(interval.interval);
                expect(interval.previousWin).toBeLessThan(interval.followingWin);
            });

            const maxIntervalValue = response.body.max[0].interval;
            response.body.max.forEach((interval: Interval) => {
                expect(interval.interval).toBe(maxIntervalValue);
                expect(interval.followingWin - interval.previousWin).toBe(interval.interval);
                expect(interval.previousWin).toBeLessThan(interval.followingWin);
            });

            expect(minIntervalValue).toBeLessThan(maxIntervalValue);

            const currentYear = new Date().getFullYear();
            const minValidYear = 1895;

            response.body.min.forEach((interval: Interval) => {
                expect(interval.previousWin).toBeGreaterThanOrEqual(minValidYear);
                expect(interval.followingWin).toBeGreaterThanOrEqual(minValidYear);
                expect(interval.previousWin).toBeLessThanOrEqual(currentYear);
                expect(interval.followingWin).toBeLessThanOrEqual(currentYear);
            });

            response.body.max.forEach((interval: Interval) => {
                expect(interval.previousWin).toBeGreaterThanOrEqual(minValidYear);
                expect(interval.followingWin).toBeGreaterThanOrEqual(minValidYear);
                expect(interval.previousWin).toBeLessThanOrEqual(currentYear);
                expect(interval.followingWin).toBeLessThanOrEqual(currentYear);
            });

            response.body.min.forEach((interval: Interval) => {
                expect(typeof interval.producer).toBe('string');
                expect(interval.producer.length).toBeGreaterThan(0);
            });

            response.body.max.forEach((interval: Interval) => {
                expect(typeof interval.producer).toBe('string');
                expect(interval.producer.length).toBeGreaterThan(0);
            });

            expect(response.body).toMatchSnapshot();
        });
    });
});
