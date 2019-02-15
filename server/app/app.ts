import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as express from "express";
import { inject, injectable } from "inversify";
import * as logger from "morgan";
import { CardManagerController } from "./controllers/card-manager.controller";
import { HighscoreController } from "./controllers/highscore.controller";
import { UserController } from "./controllers/user.controller";
import { DifferenceCheckerController } from "./services/difference-checker/difference-checker.controller";
import Types from "./types";

@injectable()
export class Application {

    private readonly internalError: number = 500;
    public app: express.Application;

    public constructor(
        @inject(Types.CardManagerController) private cardManagerController: CardManagerController,
        @inject(Types.HighscoreController) private highscoreController: HighscoreController,
        @inject(Types.UserController) private userController: UserController,
        @inject(Types.DifferenceCheckerController) private differenceCheckerController: DifferenceCheckerController,

        ) {
        this.app = express();

        this.config();

        this.bindRoutes();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger("dev"));
        this.app.use(cookieParser());
        this.app.use(cors());
        this.app.use(bodyParser.json({limit: "50mb"}));
        this.app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
    }

    public bindRoutes(): void {
        // Notre application utilise le routeur de notre API `Index`
        this.app.use("/api/card", this.cardManagerController.router);
        this.app.use("/api/highscore", this.highscoreController.router);
        this.app.use("/api/user", this.userController.router);
        this.app.use("/api/differenceChecker", this.differenceCheckerController.router);
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
