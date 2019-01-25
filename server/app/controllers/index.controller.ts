import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { Message } from "../../../common/communication/message";
import { IndexService } from "../services/index.service";
import Types from "../types";

@injectable()
export class IndexController {

    public constructor(@inject(Types.IndexService) private indexService: IndexService) { }

    public get router(): Router {
        const router: Router = Router();

        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                const time: Message = await this.indexService.helloWorld();
                res.json(time);
            });

        router.get("/about", (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                res.json(this.indexService.about());
            });

        router.get("/asset/:filename", (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                const file: string = req.params.filename;
                // tslint:disable-next-line:no-any
                const path: any = require("path");
                const url: string = path.join(__dirname, "../../../../app/asset/images/" + file);
                res.sendFile(url);
            });

        return router;
    }
}
