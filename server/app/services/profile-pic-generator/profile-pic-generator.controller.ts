import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";

import Types from "../../types";
import { ProfilePicGeneratorService } from "./profile-pic-generator.service";

@injectable()
export class ProfilePicGeneratorController {

    public constructor(
        @inject(Types.ProfilePicGeneratorService) private profilePicGeneratorService: ProfilePicGeneratorService,
        ) {}

    public get router(): Router {

        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.json(this.profilePicGeneratorService.generateRandomImage());
        });

        return router;
    }
}
