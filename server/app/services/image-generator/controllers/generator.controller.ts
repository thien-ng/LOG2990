
import { NextFunction, Request, Response, Router } from "express";
import { injectable } from "inversify";

@injectable()
export class GeneratorController {

    public constructor() {
        // default constructor
    }

    public get router(): Router {
        const router: Router = Router();

        router.post("/", async (req: Request, res: Response, next: NextFunction) => {
            // test response
            res.json("test");
        });

        return router;
    }

}
