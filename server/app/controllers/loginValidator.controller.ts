import { NextFunction, Request, Response, Router } from "express";
import { injectable } from "inversify";

import { Constants } from "../constants";

@injectable()
export class LoginValidatorController {

    public constructor() {
        // default constructor
     }

    public get router(): Router {

        const router: Router = Router();

        router.post("/newUsername", (req: Request, res: Response, next: NextFunction) => {
            
        });

        return router;
    }
}
