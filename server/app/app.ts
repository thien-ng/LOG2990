import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as express from "express";
import { inject, injectable } from "inversify";
import * as logger from "morgan";
import { CardManagerController } from "./controllers/card-manager.controller";
import { HighscoreController } from "./controllers/highscore.controller";
import { LoginValidatorController } from "./controllers/loginValidator.controller";
import { GeneratorController } from "./services/image-generator/controllers/generator.controller";
import Types from "./types";

@injectable()
export class Application {

    private readonly internalError: number = 500;
    public app: express.Application;

    public constructor(
        @inject(Types.GeneratorController) private generatorController: GeneratorController,
        @inject(Types.CardManagerController) private cardManagerController: CardManagerController,
        @inject(Types.HighscoreController) private highscoreController: HighscoreController,
        @inject(Types.LoginValidatorController) private loginValidatorController: LoginValidatorController,
        ) {
        this.app = express();

        this.config();

        this.bindRoutes();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    public bindRoutes(): void {
        // Notre application utilise le routeur de notre API `Index`
        this.app.use("/api/generator", this.generatorController.router);
        this.app.use("/api/card", this.cardManagerController.router);
        this.app.use("/api/highscore", this.highscoreController.router);
        this.app.use("/api/loginValidation", this.loginValidatorController.router);
        this.app.use(express.static("./app/asset"));
        this.errorHandeling();
    }

    private errorHandeling(): void {
        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error("Not Found");
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get("env") === "development") {
            // tslint:disable-next-line:no-any
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        // tslint:disable-next-line:no-any
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
