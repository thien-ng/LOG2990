import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { HitValidatorService2D } from "./hitValidator2D.service";
import { HitValidatorService3D } from "./hitValidator3D.service";
import { IHitToValidate } from "./interfaces";

import { IPosition2D } from "../../../../common/communication/iGameplay";
import Types from "../../types";
import { GameMode } from "../../../../common/communication/iCard";

@injectable()
export class HitValidatorController {

    public constructor(
        @inject(Types.HitValidatorService2D) private hitValidatorService2D: HitValidatorService2D,
        @inject(Types.HitValidatorService3D) private hitValidatorService3D: HitValidatorService3D) {}

    public get router(): Router {

        const router: Router = Router();

        router.post("/2d", async (req: Request, res: Response, next: NextFunction) => {

            const hitToValidate: IHitToValidate = {
                eventInfo:          req.body.eventInfo,
                differenceDataURL:  String(req.body.differenceDataURL),
                colorToIgnore:      req.body.colorToIgnore,
            };

            res.json(await this.hitValidatorService2D.confirmHit(hitToValidate));
        });

        router.post("/3d", async (req: Request, res: Response, next: NextFunction) => {

            const hitToValidate: IHitToValidate = {
                eventInfo:          req.body.eventInfo,
                differenceDataURL:  String(req.body.differenceDataURL),
            };

            res.json(await this.hitValidatorService3D.confirmHit(hitToValidate));
        });

        return router;
    }

}
