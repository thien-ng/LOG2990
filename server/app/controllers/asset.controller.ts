import { NextFunction, Request, Response, Router } from "express";
import { injectable } from "inversify";

@injectable()
export class AssetController {

    public constructor() {
        // default constructor
     }

    public get router(): Router {
        const router: Router = Router();

        router.get("/images/:filename", (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                const file: string = req.params.filename;
                // tslint:disable-next-line:no-any
                const path: any = require("path");
                const pathRerouting: string = "../../../../app/asset/images/";
                const url: string = path.join(__dirname, pathRerouting + file);
                res.sendFile(url);
            });

        return router;
    }
}
