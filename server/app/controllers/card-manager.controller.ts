import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { ICardLists } from "../../../common/communication/iCardLists";
import { CardManagerService } from "../services/card-manager.service";
import Types from "../types";

const DECIMAL: number = 10;

@injectable()
export class CardManagerController {

    public constructor(@inject(Types.CardManagerService) private cardManagerService: CardManagerService) { }

    public get router(): Router {
        const router: Router = Router();

        router.get("/list", async (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                const list: ICardLists = this.cardManagerService.getCards();
                res.json(list);
        });

        router.delete("/remove/simple/:id", async (req: Request, res: Response, next: NextFunction) => {
            const cardId: number = parseInt(req.params.id, DECIMAL);
            const message: string = this.cardManagerService.removeCard2D(cardId);
            res.json(message);
        });

        router.delete("/remove/free/:id", async (req: Request, res: Response, next: NextFunction) => {
            const cardId: number = parseInt(req.params.id, DECIMAL);
            const message: string = this.cardManagerService.removeCard3D(cardId);
            res.json(message);
        });

        return router;
    }
}
