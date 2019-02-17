import { Container } from "inversify";
import { Application } from "./app";
import { CardManagerController } from "./controllers/card-manager.controller";
import { GameManagerController } from "./controllers/game-manager.controller";
import { HighscoreController } from "./controllers/highscore.controller";
import { SceneManagerController } from "./controllers/scene-manager.controller";
import { UserController } from "./controllers/user.controller";
import { Server } from "./server";
import { CardManagerService } from "./services/card-manager.service";
import { DifferenceCheckerController } from "./services/difference-checker/difference-checker.controller";
import { DifferenceCheckerService } from "./services/difference-checker/difference-checker.service";
import { GameManager } from "./services/game/game-manager.service";
import { HighscoreService } from "./services/highscore.service";
import { SceneManager } from "./services/scene/scene-manager.service";
import { UserManagerService } from "./services/user-manager.service";
import Types from "./types";
import { WebsocketManager } from "./websocket/WebsocketManager";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.WebsocketManager).to(WebsocketManager);

container.bind(Types.UserController).to(UserController);
container.bind(Types.UserManagerService).to(UserManagerService).inSingletonScope();
container.bind(Types.CardManagerController).to(CardManagerController);
container.bind(Types.CardManagerService).to(CardManagerService).inSingletonScope();

container.bind(Types.HighscoreController).to(HighscoreController);
container.bind(Types.HighscoreService).to(HighscoreService).inSingletonScope();

container.bind(Types.DifferenceCheckerController).to(DifferenceCheckerController);
container.bind(Types.DifferenceCheckerService).to(DifferenceCheckerService);

container.bind(Types.GameManagerController).to(GameManagerController);
container.bind(Types.GameManager).to(GameManager).inSingletonScope();

container.bind(Types.SceneManagerController).to(SceneManagerController);
container.bind(Types.SceneManager).to(SceneManager).inSingletonScope();

export { container };
