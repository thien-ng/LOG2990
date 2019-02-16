import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { HitValidatorService } from "./hitValidator.service";

import Types from "../../types";

@injectable()
export class HitValidatorController {

    public constructor(@inject(Types.HitValidatorService) private hitValidatorService: HitValidatorService) {}

    public get router(): Router {

        const router: Router = Router();

        router.post("/", (req: Request, res: Response, next: NextFunction) => {

            const color: Promise<number> = this.hitValidatorService.confirmHit(
                Number(req.body.inputX),
                Number(req.body.inputY),
                String(req.body.imageUrl),
            );

            res.json({
                "Color": color,
            });
        });

        return router;
    }

}
