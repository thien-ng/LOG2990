import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { GameManagerService } from "../services/game/game-manager.service";

import Types from "../types";

@injectable()
export class GameManagerController {

    public constructor(@inject(Types.GameManagerService) private gameManagerService: GameManagerService) { }

    public get router(): Router {

        const router: Router = Router();

        router.post("/request", (req: Request, res: Response, next: NextFunction) => {
            this.gameManagerService.subscribeSocketID("sad");
            console.log("req");
        });

        return router;
    }
}
