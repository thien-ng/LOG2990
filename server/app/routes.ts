import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { Route } from "./routes/index";
import Types from "./types";

@injectable()
export class Routes {

    public constructor(@inject(Types.Index) private index: Route.Index) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get("/",
                   (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));

        return router;
    }
}
