import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { IOriginalPixelCluster, IPlayerInputResponse, IPosition2D } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { Constants } from "../../../constants";
import { Arena } from "./arena";
import { IArenaInfos, IHitConfirmation, IHitToValidate } from "./interfaces";
import { Player } from "./player";
import { Timer } from "./timer";

const axios: AxiosInstance = require("axios");

export class Referee {

    private readonly ERROR_HIT_VALIDATION:  string = "Problem during Hit Validation process.";
    private readonly ON_FAILED_CLICK:       string = "onFailedClick";

    private readonly POINTS_TO_WIN_SINGLE:  number = 7;
    private readonly POINTS_TO_WIN_MULTI:   number = 4;

    private differencesFound:       number[];
    private pointsNeededToWin:      number;

    public constructor(public  arena:               Arena,
                       private players:             Player[],
                       private originalElements:    Map<number, IOriginalPixelCluster>,
                       public  timer:               Timer,
                       public  arenaInfos:          IArenaInfos,
    ) {

        this.timer = new Timer();
        this.pointsNeededToWin = players.length === 1 ? this.POINTS_TO_WIN_SINGLE : this.POINTS_TO_WIN_MULTI;

        this.differencesFound = [];
        this.initTimer();
    }

}
