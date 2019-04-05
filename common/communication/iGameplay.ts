import { GameMode } from "./iCard";
import { Mode } from "./highscore";

export interface IPosition2D {
    x:  number;
    y:  number;
}

export interface IColorRGB {
    R:  number;
    G:  number;
    B:  number;
}

export interface IClickMessage<T> {
    value:          T;
    arenaID:        number;
    username:       string;
}

export interface IReplacementPixel {
    color:          IColorRGB;
    position:       IPosition2D;
}

export interface IOriginalPixelCluster {
    differenceKey:  number;
    cluster:        IReplacementPixel[];
}

export interface ISceneObjectUpdate<OBJ_T> {
    actionToApply:  ActionType;
    sceneObject?:   OBJ_T;
}

export interface IArenaResponse<RES_T> {
    status:         string;
    response?:      RES_T;
    arenaType?:     GameMode;
    username?:      string;
}

export interface IPenalty {
    isOnPenalty:    boolean;
    arenaType:      GameMode;
}

export interface INewGameInfo {
    path:   string;
    gameID: number;
    type:   Mode;
};

export interface INewScore {
    player: string;
    score:  number;
}

export interface ICheat {
    action: ActionType;
    id:     number;
}

export enum ActionType {
    ADD,
    CHANGE_COLOR,
    DELETE,
    NO_ACTION_REQUIRED,
}