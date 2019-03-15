import { ISceneObject } from "./iSceneObject";
import { SceneType } from "./iSceneOptions";

export interface ISceneData {
    originalScene:      ISceneVariables;
    modifiedScene:      ISceneVariables;
    modifications:      IModification[];
}

export interface IModification {
    id:                 number;
    type:               ModificationType;
}

export enum ModificationType {
    added,
    removed,
    changedColor,
  }

export interface ISceneVariables {
    theme:                  SceneType;
    gameName:               string;
    sceneObjectsQuantity:   number;
    sceneObjects:           ISceneObject[];
    sceneBackgroundColor:   string;
}
