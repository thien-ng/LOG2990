import { Container } from "inversify";
import { Application } from "./app";
import { CardManagerController } from "./controllers/card-manager.controller";
import { Server } from "./server";
import { CardManagerService } from "./services/card-manager.service";
import { GeneratorController } from "./services/image-generator/controllers/generator.controller";
import { NameValidatorService } from "./services/validator/NameValidatorService";
import { GeneratorManager } from "./services/image-generator/services/generatorManager.service";
import Types from "./types";
import { HighscoreController } from "./controllers/highscore.controller";
import { LoginValidatorController } from "./controllers/loginValidator.controller";
import { HighscoreService } from "./services/highscore.service";
import { WebsocketManager } from "./websocket/WebsocketManager";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.WebsocketManager).to(WebsocketManager);

container.bind(Types.LoginValidatorController).to(LoginValidatorController);
container.bind(Types.NameValidatorService).to(NameValidatorService);
container.bind(Types.GeneratorController).to(GeneratorController);
container.bind(Types.GeneratorManager).to(GeneratorManager);

container.bind(Types.CardManagerController).to(CardManagerController);
container.bind(Types.CardManagerService).to(CardManagerService);

container.bind(Types.HighscoreController).to(HighscoreController);
container.bind(Types.HighscoreService).to(HighscoreService).inSingletonScope();

export { container };
