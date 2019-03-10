import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Highscore } from "../../../../common/communication/highscore";
import { HighscoreApiService } from "./highscore-api.service";

import Types from "../../types";

@injectable()
export class HighscoreApiController {

    public constructor(@inject(Types.HighscoreApiService) private highscoreApiService: HighscoreApiService) {}

    public get router(): Router {

        const router: Router = Router();

        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            const highscore: Highscore = this.highscoreApiService.checkScore(req.body.newValue, req.body.times, req.body.mode);
            res.json(highscore);
        });

        return router;
    }
}
