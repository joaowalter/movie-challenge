import request from 'supertest';
import app from '../../src/app';

describe('AwardController CSV Data', () => {
    describe('GET /api/awards/award-intervals com dados do csv', () => {
        it('deve retornar 200 com dados válidos', async () => {
            const response = await request(app)
                .get('/api/awards/award-intervals')
                .expect(200);

                expect(response.body).toHaveProperty('min');
                expect(response.body).toHaveProperty('max');
                expect(response.body.min).toBeInstanceOf(Array);
                expect(response.body.max).toBeInstanceOf(Array);

                if(response.body.min.length > 0 && response.body.max.length > 0) {
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
            const response = await request(app)
                .get('/api/awards/award-intervals')
                .expect(200);

                if(response.body.min.length > 0 && response.body.max.length > 0) {
                    const minInterval = response.body.min[0].interval;
                    const maxInterval = response.body.max[0].interval;
                    expect(minInterval).toBeLessThanOrEqual(maxInterval);
                }
        });
    });
});