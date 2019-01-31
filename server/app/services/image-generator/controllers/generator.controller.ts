
import { NextFunction, Request, Response, Router, RequestHandler } from "express";
import { injectable } from "inversify";
import * as multer from "multer";
import * as Jimp from "jimp";

@injectable()
export class GeneratorController {

    public constructor() {
        // default constructor
    }

    public get router(): Router {
        const router: Router = Router();

        const upload: multer.Instance = multer({
            dest: "./import",
        });

       const receivedFile: RequestHandler = upload.fields([{name: "originalImage",  maxCount: 1}, {name: "modifiedImage",  maxCount: 1}]);

       router.post("/receive", receivedFile, (req: Request, res: Response, next: NextFunction) => {

           const originalBuffer: Buffer = req.files["originalImage"][0].buffer;
           const modifiedBuffer: Buffer = req.files["modifiedImage"][0].buffer;

            Jimp.read(originalBuffer)
            .then(tpl => (tpl.clone().write("./ducimage.jpg")))
            .catch(err => {
                console.error(err);
            });
            // image.write("./app/petsauce.jpg");

           res.json( {
               "firstImage": originalBuffer,
               "modifiedImage": modifiedBuffer,
           });
       });

        return router;
    }

}
