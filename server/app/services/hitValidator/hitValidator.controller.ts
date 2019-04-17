import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { HitValidatorService2D } from "./hitValidator2D.service";
import { IHitToValidate } from "./interfaces";

import { GameMode } from "../../../../common/communication/iCard";
import { IPosition2D } from "../../../../common/communication/iGameplay";
import Types from "../../types";
import { HitValidatorService3D } from "./hitValidator3D.service";

@injectable()
export class HitValidatorController {

    public constructor(
        @inject(Types.HitValidatorService2D) private hitValidatorService2D: HitValidatorService2D,
        @inject(Types.HitValidatorService3D) private hitValidatorService3D: HitValidatorService3D,
        ) {}

    public get router(): Router {

        const router: Router = Router();

        router.post("/" + GameMode.simple, async (req: Request, res: Response, next: NextFunction) => {

            const hitToValidate: IHitToValidate<IPosition2D> = {
                eventInfo:          req.body.eventInfo,
                differenceDataURL:  String(req.body.differenceDataURL),
                colorToIgnore:      req.body.colorToIgnore,
            };

            res.json(await this.hitValidatorService2D.confirmHit(hitToValidate));
        });

        router.post("/" + GameMode.free, async (req: Request, res: Response, next: NextFunction) => {

            const hitToValidate: IHitToValidate<number> = {
                eventInfo:          req.body.eventInfo,
                differenceDataURL:  String(req.body.differenceDataURL),
            };

            res.json(await this.hitValidatorService3D.confirmHit(hitToValidate));
        });

        return router;
    }

}
