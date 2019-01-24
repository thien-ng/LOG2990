import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Message } from "../../../common/communication/message";
import { DateService } from "../services/date.service";
import Types from "../types";

const OBLIGATORY_CATCH: string = "obligatory catch";

@injectable()
export class DateController {

    public constructor(@inject(Types.DateService) private dateService: DateService) { }

    public get router(): Router {
        const router: Router = Router();
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                this.dateService.currentTime().then((time: Message) => {
                    res.json(time);
                }).catch(() => OBLIGATORY_CATCH);
            });

        return router;
    }
}
