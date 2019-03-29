import { Container } from "inversify";
import { Application } from "./app";
import { CardManagerController } from "./controllers/card-manager.controller";
import { GameManagerController } from "./controllers/game-manager.controller";
import { HighscoreController } from "./controllers/highscore.controller";
import { SceneManagerController } from "./controllers/scene-manager.controller";
import { UserController } from "./controllers/user.controller";
import { Server } from "./server";
import { AssetManagerService } from "./services/asset-manager.service";
import { CardManagerService } from "./services/card-manager.service";
import { CardOperations } from "./services/card-operations.service";
import { ChatManagerService } from "./services/chat-manager.service";
import { DifferenceCheckerController } from "./services/difference-checker/difference-checker.controller";
import { DifferenceCheckerService } from "./services/difference-checker/difference-checker.service";
import { GameManagerService } from "./services/game/game-manager.service";
import { LobbyManagerService } from "./services/game/lobby-manager.service";
import { HighscoreService } from "./services/highscore.service";
import { HighscoreApiController } from "./services/highscore/highscore-api.controller";
import { HighscoreApiService } from "./services/highscore/highscore-api.service";
import { HitValidatorController } from "./services/hitValidator/hitValidator.controller";
import { HitValidatorService2D } from "./services/hitValidator/hitValidator2D.service";
import { HitValidatorService3D } from "./services/hitValidator/hitValidator3D.service";
import { ProfilePicGeneratorController } from "./services/profile-pic-generator/profile-pic-generator.controller";
import { ProfilePicGeneratorService } from "./services/profile-pic-generator/profile-pic-generator.service";
import { SceneManager } from "./services/scene/scene-manager.service";
import { TimeManagerService } from "./services/time-manager.service";
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
container.bind(Types.CardOperations).to(CardOperations).inSingletonScope();

container.bind(Types.HighscoreController).to(HighscoreController);
container.bind(Types.HighscoreService).to(HighscoreService).inSingletonScope();

container.bind(Types.HighscoreApiController).to(HighscoreApiController);
container.bind(Types.HighscoreApiService).to(HighscoreApiService);

container.bind(Types.DifferenceCheckerController).to(DifferenceCheckerController);
container.bind(Types.DifferenceCheckerService).to(DifferenceCheckerService);

container.bind(Types.HitValidatorController).to(HitValidatorController);
container.bind(Types.HitValidatorService2D).to(HitValidatorService2D);
container.bind(Types.HitValidatorService3D).to(HitValidatorService3D);

container.bind(Types.GameManagerController).to(GameManagerController);
container.bind(Types.GameManagerService).to(GameManagerService).inSingletonScope();
container.bind(Types.LobbyManagerService).to(LobbyManagerService).inSingletonScope();

container.bind(Types.SceneManagerController).to(SceneManagerController);
container.bind(Types.SceneManager).to(SceneManager).inSingletonScope();

container.bind(Types.TimeManagerService).to(TimeManagerService).inSingletonScope();
container.bind(Types.ChatManagerService).to(ChatManagerService).inSingletonScope();

container.bind(Types.AssetManagerService).to(AssetManagerService).inSingletonScope();

container.bind(Types.ProfilePicGeneratorController).to(ProfilePicGeneratorController);
container.bind(Types.ProfilePicGeneratorService).to(ProfilePicGeneratorService);

export { container };
