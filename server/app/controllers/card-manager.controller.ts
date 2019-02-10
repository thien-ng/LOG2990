import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { inject, injectable } from "inversify";

import * as multer from "multer";
import { ICardLists } from "../../../common/communication/iCardLists";
import { Message } from "../../../common/communication/message";
import { CardManagerService } from "../services/card-manager.service";
import Types from "../types";

const DECIMAL: number = 10;
const ORIGINAL_IMAGE_NAME: string = "originalImage";
const MODIFIED_IMAGE_NAME: string = "modifiedImage";

@injectable()
export class CardManagerController {

    public constructor(@inject(Types.CardManagerService) private cardManagerService: CardManagerService) { }

    public get router(): Router {

        const upload: multer.Instance = multer();
        const router: Router = Router();

        const receivedFile: RequestHandler = upload.fields(
            [
                {
                    name: ORIGINAL_IMAGE_NAME,
                    maxCount: 1,
                },
                {
                    name: MODIFIED_IMAGE_NAME,
                    maxCount: 1,
                },
            ]);

        router.post("/submitSimple", receivedFile, async (req: Request, res: Response, next: NextFunction) => {

            const originalBuffer: Buffer = req.files[ORIGINAL_IMAGE_NAME][0].buffer;
            const modifiedBuffer: Buffer = req.files[MODIFIED_IMAGE_NAME][0].buffer;

            const result: Message = await this.cardManagerService.cardCreationRoutine(originalBuffer, modifiedBuffer, req.body.name);

            res.json(result);
        });
        router.post("/submitFree", async (req: Request, res: Response, next: NextFunction) => {

            // req is formdata To be sent to sceneCreation
            // DO not forget to send message On succes and onError
            res.json();
        });

        router.get("/list", async (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                const list: ICardLists = this.cardManagerService.getCards();
                res.json(list);
        });

        router.delete("/remove/simple/:id", async (req: Request, res: Response, next: NextFunction) => {
            const cardId: number = parseInt(req.params.id, DECIMAL);
            try {
                const message: string = this.cardManagerService.removeCard2D(cardId);
                res.json(message);
            } catch (error) {
                res.json(error.message);
            }
        });

        router.delete("/remove/free/:id", async (req: Request, res: Response, next: NextFunction) => {
            const cardId: number = parseInt(req.params.id, DECIMAL);
            const message: string = this.cardManagerService.removeCard3D(cardId);
            res.json(message);
        });

        return router;
    }
}
