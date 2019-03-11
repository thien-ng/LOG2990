import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { HighscoreApiService } from "./highscore-api.service";
import { HighscoreValidationResponse } from "./utilities/interfaces";

import Types from "../../types";

@injectable()
export class HighscoreApiController {

    public constructor(@inject(Types.HighscoreApiService) private highscoreApiService: HighscoreApiService) {}

    public get router(): Router {

        const router: Router = Router();

        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            const highscore: HighscoreValidationResponse = this.highscoreApiService.checkScoreRoutine(req.body);
            res.json(highscore);
        });

        return router;
    }
}
