import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { HitValidatorService } from "./hitValidator.service";
import { IHitToValidate } from "./interfaces";

import Types from "../../types";

@injectable()
export class HitValidatorController {

    public constructor(@inject(Types.HitValidatorService) private hitValidatorService: HitValidatorService) {}

    public get router(): Router {

        const router: Router = Router();

        router.post("/", async (req: Request, res: Response, next: NextFunction) => {

            const hitToValidate: IHitToValidate = {
                posX: req.body.inputX,
                posY: req.body.inputY,
                imageUrl: String(req.body.imageUrl),
                colorToIgnore: req.body.colorToIgnore,
            };

            res.json(await this.hitValidatorService.confirmHit(hitToValidate));
        });

        return router;
    }

}
