import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { DifferenceCheckerService } from "./difference-checker.service";
import { Message } from "./utilities/message";

import Types from "../../types";

@injectable()
export class DifferenceCheckerController {

    public constructor(@inject(Types.DifferenceCheckerService) private differenceCheckerService: DifferenceCheckerService) {}

    public get router(): Router {

        const router: Router = Router();

        router.post("/", (req: Request, res: Response, next: NextFunction) => {

            const result: Message | Buffer = this.differenceCheckerService.generateDifferenceImage(req.body);

            res.json(result);
        });

        return router;
    }
}
