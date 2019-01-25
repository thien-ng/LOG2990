import { NextFunction, Request, Response, Router } from "express";
import { injectable } from "inversify";

@injectable()
export class AssetController {

    public constructor() {
        // default constructor
     }

    public get router(): Router {
        const router: Router = Router();

        // tslint:disable-next-line:no-any
        const path: any = require("path");
        const pathToAssets: string = "../../../../app/asset";

        router.get("/image/:filename", (req: Request, res: Response, next: NextFunction) => {
                // Create the relative path to the aimed directory and sends the file specified if found, 404 otherwise
                const url: string = path.join(__dirname, pathToAssets + "/image/" + req.params.filename);
                res.sendFile(url);
            });

        router.get("/icon/:filename", (req: Request, res: Response, next: NextFunction) => {
                // Create the relative path to the aimed directory and sends the file specified if found, 404 otherwise
                const url: string = path.join(__dirname, pathToAssets + "/icon/" + req.params.filename);
                res.sendFile(url);
            });

        return router;
    }
}
