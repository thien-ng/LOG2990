import { Container } from "inversify";
import { Application } from "./app";
import { AssetController } from "./controllers/asset.controller";
import { DateController } from "./controllers/date.controller";
import { IndexController } from "./controllers/index.controller";
import { Server } from "./server";
import { DateService } from "./services/date.service";
import { IndexService } from "./services/index.service";
import { NameValidatorService } from "./services/validator/NameValidatorService";
import { WebsocketManager } from "./services/websocket/Websocket";

import Types from "./types";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.IndexController).to(IndexController);
container.bind(Types.AssetController).to(AssetController);
container.bind(Types.IndexService).to(IndexService);

container.bind(Types.DateController).to(DateController);
container.bind(Types.DateService).to(DateService);
container.bind(Types.WebsocketManager).to(WebsocketManager);
container.bind(Types.NameValidatorService).to(NameValidatorService);

export { container };
