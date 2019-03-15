import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { Message } from "../../../common/communication/message";
import { GameManagerService } from "../services/game/game-manager.service";
import Types from "../types";

@injectable()
export class GameManagerController {

    public constructor(@inject(Types.GameManagerService) private gameManagerService: GameManagerService) { }

    public get router(): Router {

        const router: Router = Router();

        router.post("/request", async (req: Request, res: Response, next: NextFunction) => {
            const response: Message = await this.gameManagerService.analyseRequest(req.body);
            res.json(response);
        });

        router.post("/validate", async (req: Request, res: Response, next: NextFunction) => {
            res.json(await this.gameManagerService.onPlayerInput(req.body));
        });

        router.get("/cancel-request/:id", async (req: Request, res: Response, next: NextFunction) => {
            const id: number = Number(req.params.id);
            res.json(this.gameManagerService.cancelRequest(id));
        });

        return router;
    }
}
