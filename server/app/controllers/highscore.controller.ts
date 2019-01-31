import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { Highscore } from "../../../common/communication/highscore";
import { HighscoreService } from "../services/highscore.service";
import Types from "../types";

const DECIMAL: number = 10;

@injectable()
export class HighscoreController {

    public constructor(@inject(Types.HighscoreService) private highScoreService: HighscoreService) { }

    public get router(): Router {
        const router: Router = Router();

        router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
            const cardId: number = parseInt(req.params.id, DECIMAL);
            const highscore: Highscore | undefined = this.highScoreService.getHighscoreById(cardId);
            res.json(highscore);
        });

        return router;
    }
}
