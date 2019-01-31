import { Container } from "inversify";
import { Application } from "./app";
import { CardManagerController } from "./controllers/card-manager.controller";
import { DateController } from "./controllers/date.controller";
import { IndexController } from "./controllers/index.controller";
import { Server } from "./server";
import { CardManagerService } from "./services/card-manager.service";
import { DateService } from "./services/date.service";
import { GeneratorController } from "./services/image-generator/controllers/generator.controller";
import { IndexService } from "./services/index.service";
import { NameValidatorService } from "./services/validator/NameValidatorService";

import { GeneratorManager } from "./services/image-generator/services/generatorManager.service";

import Types from "./types";

import { LoginValidatorController } from "./controllers/loginValidator.controller";
import { WebsocketManager } from "./websocket/WebsocketManager";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.IndexController).to(IndexController);
container.bind(Types.IndexService).to(IndexService);

container.bind(Types.DateController).to(DateController);
container.bind(Types.DateService).to(DateService);
container.bind(Types.WebsocketManager).to(WebsocketManager);

container.bind(Types.LoginValidatorController).to(LoginValidatorController);
container.bind(Types.NameValidatorService).to(NameValidatorService);
container.bind(Types.GeneratorController).to(GeneratorController);
container.bind(Types.GeneratorManager).to(GeneratorManager);

container.bind(Types.CardManagerController).to(CardManagerController);
container.bind(Types.CardManagerService).to(CardManagerService);

export { container };
