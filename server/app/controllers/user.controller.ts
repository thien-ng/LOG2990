import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { Message } from "../../../common/communication/message";
import { UserManagerService } from "../services/user-manager.service";

import Types from "../types";

@injectable()
export class UserController {

    public constructor(@inject(Types.UserManagerService) private userManagerService: UserManagerService) { }

    public get router(): Router {

        const router: Router = Router();

        router.post("/newUsername", async (req: Request, res: Response, next: NextFunction) => {
            const isValidated: Message = await this.userManagerService.validateName(req.body.body);
            res.json(isValidated);
        });

        return router;
    }
}
