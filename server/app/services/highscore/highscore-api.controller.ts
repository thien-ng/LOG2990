import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { HighscoreApiService } from "./highscore-api.service";
import { Time } from "./utilities/interfaces";

import Types from "../../types";

@injectable()
export class HighscoreApiController {

    public constructor(@inject(Types.HighscoreApiService) private highscoreApiService: HighscoreApiService) {}

    public get router(): Router {

        const router: Router = Router();

        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            const newTimes: [Time, Time, Time] = this.highscoreApiService.checkScore(req.body.newValue, req.body.times);
            res.json(newTimes);
        });

        return router;
    }
}
