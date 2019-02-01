import { NextFunction, Request, Response, Router } from "express";
import {  injectable } from "inversify";

@injectable()
export class DifferenceCheckerController {

    public constructor() {
        // default constructor
     }

    public get router(): Router {

        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            // default route
        });

        return router;
    }

}
