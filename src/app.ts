import express, { Express } from 'express';
import { DataLoader } from './utils/DataLoader';
import { AwardController } from './controllers/AwardController';
import { AwardService } from './services/AwardService';
import { createAwardRoutes } from './routes/awardRoutes';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dataLoader = new DataLoader();
dataLoader.loadDataFromCsv();

const { movieRepository, producerRepository } = dataLoader.getRepositories();

const awardService = new AwardService(movieRepository, producerRepository);
const awardController = new AwardController(awardService);
const awardRoutes = createAwardRoutes(awardController);

app.use('/api/awards', awardRoutes);

app.get('/api/awards/award-intervals', (req, res) => {
    awardController.getAwardIntervals(req, res);
});

app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});

app.get('/', (_req, res) => {
    res.json({
        message: 'API de intervalos de prêmios de filmes',
        routes: [
            {
                path: '/api/awards/award-intervals',
                method: 'GET',
                description: 'Retorna os intervalos de prêmios de filmes',
            },
            {
                path: '/health',
                method: 'GET',
                description: 'Retorna o status da API',
            },
        ],
    });
});

export default app;
