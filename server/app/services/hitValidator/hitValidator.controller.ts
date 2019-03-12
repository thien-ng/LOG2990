import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { HitValidatorService2D } from "./hitValidator2D.service";
import { HitValidatorService3D } from "./hitValidator3D.service";
import { IHitToValidate } from "./interfaces";

import Types from "../../types";

@injectable()
export class HitValidatorController {

    public constructor(
        @inject(Types.HitValidatorService2D) private hitValidatorService2D: HitValidatorService2D,
        @inject(Types.HitValidatorService3D) private hitValidatorService3D: HitValidatorService3D) {}

    public get router(): Router {

        const router: Router = Router();

        router.post("/2d", async (req: Request, res: Response, next: NextFunction) => {

            const hitToValidate: IHitToValidate = {
                position:       req.body.position,
                imageUrl:       String(req.body.imageUrl),
                colorToIgnore:  req.body.colorToIgnore,
            };

            res.json(await this.hitValidatorService2D.confirmHit(hitToValidate));
        });

        return router;
    }

}
