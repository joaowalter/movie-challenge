import { Request, Response } from 'express';
import { AwardService } from '../services/AwardService';
import { AwardResponse } from '../models/AwardResponse';

export class AwardController {
    constructor(private awardService: AwardService) {}

    getAwardIntervals(_req: Request, res: Response): Response {
        try {
            const response: AwardResponse = this.awardService.getAwardIntervals();

            return res.status(200).json(response);
        } catch (error) {
            console.error('Erro ao buscar intervalos:', error);
            return res.status(500).json({
                error: 'Erro ao buscar intervalos',
                message: error instanceof Error ? error.message : 'Erro desconhecido',
            });
        }
    }
}
