import { NextFunction, Request, Response, Router } from "express";
import { injectable } from "inversify";


@injectable()
export class SceneManagerController {

    public constructor() {}

    public get router(): Router {
        const router: Router = Router();

        router.post("/generator", async (req: Request, res: Response, next: NextFunction) => {
            console.log(req.body);
            res.json("test");
        });

        return router;
    }
}
