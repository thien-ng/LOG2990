import { ISceneObject } from "./iSceneObject";
import { SceneType } from "./iSceneOptions";

export interface ISceneVariablesMessage {
    originalScene:          ISceneVariables;
    modifiedScene:          ISceneVariables;
    modifiedIdList:         IModificationMap[];
}

export interface IModificationMap {
    id:                     number;
    type:                   IModificationType;
}

export interface ISceneVariables {
    theme:                  SceneType;
    gameName:               string;
    sceneObjectsQuantity:   number;
    sceneObjects:           ISceneObject[];
    sceneBackgroundColor:   string;
}

export enum IModificationType {
    added,
    removed,
    changedColor,
}