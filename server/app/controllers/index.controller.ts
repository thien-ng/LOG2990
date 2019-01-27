import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

// import { Message } from "../../../common/communication/message";
import { IndexService } from "../services/index.service";
import Types from "../types";

// to remove
import { GeneratorImageManager } from "../services/image-generator/services/generatorImageManager.service";

@injectable()
export class IndexController {

    public constructor(@inject(Types.IndexService) private indexService: IndexService, @inject(Types.GeneratorImageManager) private generatorImageManager: GeneratorImageManager) { }

    public get router(): Router {
        const router: Router = Router();

        router.get("/", async (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                this.generatorImageManager.readFile();
                // res.json(time);
            });

        router.get("/about", (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                this.generatorImageManager.readFile();
                res.json(this.indexService.about());
            });

        router.get("/asset/:filename", (req: Request, res: Response, next: NextFunction) => {
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
