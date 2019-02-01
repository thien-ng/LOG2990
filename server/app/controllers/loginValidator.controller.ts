import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { NameValidatorService } from "../services/validator/nameValidator.service";

import Types from "../types";

@injectable()
export class LoginValidatorController {

    public constructor(@inject(Types.NameValidatorService) private nameValidatorService: NameValidatorService) { }

    public get router(): Router {

        const router: Router = Router();

        router.post("/newUsername", (req: Request, res: Response, next: NextFunction) => {
            const isValidated: Boolean = this.nameValidatorService.validateName(req.body.body);
            res.json(isValidated);
        });

        return router;
    }
}
