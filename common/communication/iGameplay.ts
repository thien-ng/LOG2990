import { GameMode } from "./iCard";
import { ISceneObject } from "./iSceneObject";

export interface IPosition2D {
    x:  number;
    y:  number;
}

export interface IColorRGB {
    R:  number;
    G:  number;
    B:  number;
}

export interface IClickMessage3D {
    objectId:       number;
    arenaID:        number;
    username:       string;
}

export interface IClickMessage2D {
    position:       IPosition2D;
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

export interface ISceneObjectUpdate {
    actionToApply:  ActionType;
    sceneObject?:   ISceneObject;
}

export interface IArenaResponse<RES_T> {
    status:         string;
    response?:      RES_T;
    arenaType?:     GameMode;
}

export interface IPenalty {
    isOnPenalty:    boolean;
    arenaType:      GameMode;
}

export enum ActionType {
    ADD,
    CHANGE_COLOR,
    DELETE,
    NO_ACTION_REQUIRED,
}