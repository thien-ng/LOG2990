import { NextFunction, Request, Response, Router } from "express";
import { injectable } from "inversify";

import { Constants } from "../constants";

@injectable()
export class AssetController {

    public constructor() {
        // default constructor
     }

    public get router(): Router {
        const router: Router = Router();

        // tslint:disable-next-line:no-any
        const path: any = require("path");

        router.get("/image/:filename", (req: Request, res: Response, next: NextFunction) => {
                // Create the relative path to the aimed directory and sends the file specified if found, 404 otherwise
                const url: string = path.join(__dirname, Constants.PATH_FROM_CONTROLLER_TO_ASSET + "/image/" + req.params.filename);
                res.sendFile(url);
            });

        router.get("/icon/:filename", (req: Request, res: Response, next: NextFunction) => {
                // Create the relative path to the aimed directory and sends the file specified if found, 404 otherwise
                const url: string = path.join(__dirname, Constants.PATH_FROM_CONTROLLER_TO_ASSET + "/icon/" + req.params.filename);
                res.sendFile(url);
            });

        return router;
    }
}
