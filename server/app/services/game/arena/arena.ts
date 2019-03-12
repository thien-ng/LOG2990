import { AxiosInstance, AxiosResponse } from "axios";
import { inject } from "inversify";
import { GameMode } from "../../../../../common/communication/iCard";
import { IArenaResponse } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";
import Types from "../../../types";
import { GameManagerService } from "../game-manager.service";
import { IArenaInfos, IHitConfirmation } from "./interfaces";
import { Player } from "./player";
// import { Referee } from "./referee";
import { Timer } from "./timer";

const axios: AxiosInstance = require("axios");

    public readonly ARENA_TYPE: GameMode = GameMode.simple;
    public DEFAULT_DIFF_TO_UPDATE: DIFF_T;

    public sendMessage(playerSocketId: string, event: string, message: number): void {
        this.gameManagerService.sendMessage(playerSocketId, event, message);
    }
}
