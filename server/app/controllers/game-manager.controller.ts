import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { CardDeleted } from "../../../common/communication/iCard";
import { Message } from "../../../common/communication/message";
import { GameManagerService } from "../services/game/game-manager.service";
import { LobbyManagerService } from "../services/game/lobby-manager.service";
import Types from "../types";

@injectable()
export class GameManagerController {

    public constructor(
        @inject(Types.GameManagerService) private gameManagerService: GameManagerService,
        @inject(Types.LobbyManagerService) private lobbyManagerService: LobbyManagerService) { }

    public get router(): Router {

        const router: Router = Router();

        router.post("/request", async (req: Request, res: Response, next: NextFunction) => {
            const response: Message = await this.gameManagerService.analyseRequest(req.body);
            res.json(response);
        });

        router.post("/validate", async (req: Request, res: Response, next: NextFunction) => {
            res.json(await this.gameManagerService.onPlayerInput(req.body));
        });

        router.get("/cheat/:arenaId", async (req: Request, res: Response, next: NextFunction) => {
            res.json(this.gameManagerService.getDifferencesIndex(Number(req.params.arenaId)));
        });

        router.get("/cancel-request/:id/:cardDeleted", async (req: Request, res: Response, next: NextFunction) => {
            const id:           number  =   Number(req.params.id);
            const cardDeleted:  boolean =   (Number(req.params.cardDeleted) === CardDeleted.true);
            res.json(this.gameManagerService.cancelRequest(id, cardDeleted));
        });

        router.get("/active-lobby", async (req: Request, res: Response, next: NextFunction) => {
            res.json(this.lobbyManagerService.getActiveLobby());
        });

        return router;
    }
}
