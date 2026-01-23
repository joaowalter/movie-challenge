import request from 'supertest';
import app from '../../src/app';
import { Interval } from '../../src/models/AwardResponse';

describe('AwardController Integração', () => {
    describe('GET /api/awards/award-intervals', () => {
        it('deve retornar 200', async () => {
            const response = await request(app).get('/api/awards/award-intervals').expect(200);

            expect(response.status).toBe(200);
        });

        it('deve retornar content como JSON', async () => {
            const response = await request(app)
                .get('/api/awards/award-intervals')
                .expect('Content-Type', /json/);

            expect(response.headers['content-type']).toMatch(/json/);
        });

        it('deve retornar estrutura com min e max em array', async () => {
            const response = await request(app).get('/api/awards/award-intervals').expect(200);

            expect(response.body).toHaveProperty('min');
            expect(response.body).toHaveProperty('max');
            expect(response.body.min).toBeInstanceOf(Array);
            expect(response.body.max).toBeInstanceOf(Array);
        });
    });

    describe('Cálculo de intervalos', () => {
        it('valida se o min é menor que o max', async () => {
            const response = await request(app).get('/api/awards/award-intervals').expect(200);

            if (response.body.min.length > 0 && response.body.max.length > 0) {
                expect(response.body.min[0].interval).toBeLessThan(response.body.max[0].interval);
            }
        });

        it('valida se buscou e calculou os intervalos certos: previousWin, followingWin e interval', async () => {
            const response = await request(app).get('/api/awards/award-intervals').expect(200);

            response.body.min.forEach((interval: Interval) => {
                expect(interval).toHaveProperty('previousWin');
                expect(interval).toHaveProperty('followingWin');
                expect(interval).toHaveProperty('interval');

                const valueOfMinInterval = interval.followingWin - interval.previousWin;
                expect(valueOfMinInterval).toBe(interval.interval);
            });

            response.body.max.forEach((interval: Interval) => {
                expect(interval).toHaveProperty('previousWin');
                expect(interval).toHaveProperty('followingWin');
                expect(interval).toHaveProperty('interval');

                const valueOfMaxInterval = interval.followingWin - interval.previousWin;
                expect(valueOfMaxInterval).toBe(interval.interval);
            });
        });
    });
});
