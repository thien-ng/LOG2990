import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import { NameValidatorService } from "../services/validator/NameValidatorService";

import Types from "../types";

@injectable()
export class LoginValidatorController {

    public constructor(@inject(Types.NameValidatorService) private _nameValidatorService: NameValidatorService) { }

    public get router(): Router {

        const router: Router = Router();

        router.post("/newUsername/:username", (req: Request, res: Response, next: NextFunction) => {
            const isValidated: Boolean = this._nameValidatorService.validateName(req.params.username);
            res.json(isValidated);
        });

        return router;
    }
}
