import { ISceneObject } from "./iSceneObject";
import { SceneType } from "./iSceneOptions";

export interface ISceneVariablesMessage {
    originalScene:      ISceneVariables;
    modifiedScene:      ISceneVariables;
    modifications:      IModification[];
}

export interface ISceneVariables {
    theme:                  SceneType;
    gameName:               string;
    sceneObjectsQuantity:   number;
    sceneObjects:           ISceneObject[];
    sceneBackgroundColor:   string;
}
