import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { CardModel } from "../../../common/communication/cardModel";
import { CardManagerService } from "../services/card-manager.service";
import Types from "../types";

@injectable()
export class CardManagerController {

    public constructor(@inject(Types.CardManagerService) private _cardManagerService: CardManagerService) { }

    public get router(): Router {
        const router: Router = Router();

        router.get("/list", async (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                const list: CardModel[][] = this._cardManagerService.getCards();
                res.json(list);
            });

        return router;
    }
}
