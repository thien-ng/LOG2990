import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { IModification } from "../../../common/communication/iSceneVariables";
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

        router.get("/id", async (req: Request, res: Response, next: NextFunction) => {
            // TODO: implement return real modification values
            const iModificationMap: IModification[] = [{id: 1, type: 1}, {id: 2, type: 1} , {id: 3, type: 1}, {id: 4, type: 1}];
            res.json(iModificationMap);
        });

        return router;
    }
}
