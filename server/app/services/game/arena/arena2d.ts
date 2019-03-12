import { inject } from "inversify";
import { GameMode } from "../../../../../common/communication/iCard";
import { IArenaResponse, IOriginalPixelCluster, IPosition2D } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";
import { Constants } from "../../../constants";
import Types from "../../../types";
import { GameManagerService } from "../game-manager.service";
import { Arena } from "./arena";
import { DifferencesExtractor } from "./differencesExtractor";
import { IArenaInfos, IHitConfirmation, IPlayerInput } from "./interfaces";
import { Referee } from "./referee";

export class Arena2D extends Arena {
    // dfg
}
