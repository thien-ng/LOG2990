import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { GameManager } from "../services/game/game-manager.service";

import Types from "../types";

@injectable()
export class GameManagerController {

    public constructor(@inject(Types.GameManager) private gameManager: GameManager) { }

    public get router(): Router {

        const router: Router = Router();

        router.post("/request", (req: Request, res: Response, next: NextFunction) => {
            console.log("req");
        });

        return router;
    }
}
