
import { NextFunction, Request, Response, Router } from "express";
import { injectable } from "inversify";

@injectable()
export class GeneratorController {

    public constructor() {
        // default constructor
    }

    public get router(): Router {
        const router: Router = Router();

        router.post("/receive", (req: Request, res: Response, next: NextFunction) => {

           res.json( {
               "firstImage": "zizi bander",
               "modifiedImage": "micahel",
           });
       });

        return router;
    }

}
