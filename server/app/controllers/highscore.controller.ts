import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { HighscoreService } from "../services/highscore.service";

import Types from "../types";

const BASE_DECIMAL: number = 10;

@injectable()
export class HighscoreController {

    public constructor(@inject(Types.HighscoreService) private highScoreService: HighscoreService) { }

    public get router(): Router {
        const router: Router = Router();

        router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
            const highscoreID: number = parseInt(req.params.id, BASE_DECIMAL);
            res.json(this.highScoreService.getHighscoreById(highscoreID));
        });

        router.get("/generator/:id", async(req: Request, res: Response, next: NextFunction) => {
            const highscoreID: number = parseInt(req.params.id, BASE_DECIMAL);
            res.json(this.highScoreService.generateNewHighscore(highscoreID));
        });

        return router;
    }
}
