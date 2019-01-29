import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { ICardLists } from "../../../common/communication/iCardLists";
import { CardManagerService } from "../services/card-manager.service";
import Types from "../types";

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

        router.post("/remove", async (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            const isDeleted: boolean = this.cardManagerService.removeCard(req.body);
            res.json(isDeleted);
        });

        return router;
    }
}
