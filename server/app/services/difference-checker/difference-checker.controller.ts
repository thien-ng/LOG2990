import { NextFunction, Request, Response, Router } from "express";
import {  inject, injectable } from "inversify";
import { Message } from "../../../../common/communication/message";
import { DifferenceCheckerService } from "./difference-checker.service";

import Types from "../../types";

@injectable()
export class DifferenceCheckerController {

    public constructor(@inject(Types.DifferenceCheckerService) private differenceCheckerService: DifferenceCheckerService) {
        // default constructor
    }

    public get router(): Router {

        const router: Router = Router();

        router.post("/validate", (req: Request, res: Response, next: NextFunction) => {

            const result: Message | Buffer = this.differenceCheckerService.generateDifferenceImage(req.body);

            res.json(result);
        });

        return router;
    }

}
