import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { inject, injectable } from "inversify";

import * as multer from "multer";
import { ICard } from "../../../common/communication/iCard";
import { ICardLists } from "../../../common/communication/iCardLists";
import { Message } from "../../../common/communication/message";
import { Constants } from "../constants";
import { CardManagerService } from "../services/card-manager.service";
import { CardOperations } from "../services/card-operations.service";
import { ImageRequirements } from "../services/difference-checker/utilities/imageRequirements";
import Types from "../types";

const DECIMAL: number = 10;
const ORIGINAL_IMAGE_NAME: string = "originalImage";
const MODIFIED_IMAGE_NAME: string = "modifiedImage";

@injectable()
export class CardManagerController {

    public constructor(
        @inject(Types.CardManagerService) private cardManagerService: CardManagerService,
        @inject(Types.CardOperations) private cardOperations: CardOperations) { }

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

            const requirements: ImageRequirements = {
                requiredHeight: Constants.REQUIRED_HEIGHT,
                requiredWidth: Constants.REQUIRED_WIDTH,
                requiredNbDiff: Constants.REQUIRED_NB_DIFF,
                originalImage: originalBuffer,
                modifiedImage: modifiedBuffer,
            };

            const result: Message = await this.cardManagerService.simpleCardCreationRoutine(requirements, req.body.name);

            res.json(result);
        });
        router.post("/submitFree", async (req: Request, res: Response, next: NextFunction) => {
            res.json(this.cardManagerService.freeCardCreationRoutine(req.body));
        });

        router.get("/list", async (req: Request, res: Response, next: NextFunction) => {
                const list: ICardLists = this.cardManagerService.getCards();
                res.json(list);
        });

        router.get("/:id/:gameMode", async (req: Request, res: Response, next: NextFunction) => {
            const card: ICard = this.cardOperations.getCardById(req.params.id, req.params.gameMode);
            res.json(card);
        });

        router.delete("/remove/simple/:id", async (req: Request, res: Response, next: NextFunction) => {
            const cardId: number = parseInt(req.params.id, DECIMAL);
            try {
                const message: string = this.cardOperations.removeCard2D(cardId);
                res.json(message);
            } catch (error) {
                const isTypeError: boolean = error instanceof TypeError;
                const errorMessage: string = isTypeError ? error.message : Constants.UNKNOWN_ERROR;
                res.json(errorMessage);
            }
        });

        router.delete("/remove/free/:id", async (req: Request, res: Response, next: NextFunction) => {
            const cardId: number = parseInt(req.params.id, DECIMAL);
            const message: string = this.cardOperations.removeCard3D(cardId);
            res.json(message);
        });

        return router;
    }

}
