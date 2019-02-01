import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { inject, injectable } from "inversify";

import * as multer from "multer";
import { ICardLists } from "../../../common/communication/iCardLists";
import { CardManagerService } from "../services/card-manager.service";
import Types from "../types";

const DECIMAL: number = 10;

@injectable()
export class CardManagerController {

    public constructor(@inject(Types.CardManagerService) private cardManagerService: CardManagerService) { }

    public get router(): Router {

        const upload: multer.Instance = multer();
        const router: Router = Router();

        const receivedFile: RequestHandler = upload.fields(
            [
                {
                    name: "original",
                    maxCount: 1,
                },
                {
                    name: "modified",
                    maxCount: 1,
                },
            ]);

        router.post("/submit", receivedFile, async (req: Request, res: Response, next: NextFunction) => {

            const originalBuffer: Buffer = req.files["original"][0].buffer;
            const modifiedBuffer: Buffer = req.files["modified"][0].buffer;
            // let response;

            const val: boolean = await this.cardManagerService.cardCreationRoutine(originalBuffer, modifiedBuffer);

            res.json(val);
        });

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
