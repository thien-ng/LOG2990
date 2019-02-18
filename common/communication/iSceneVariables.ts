import { ISceneObject } from "./iSceneObject";

export interface ISceneVariablesMessage {
    originalScene: ISceneVariables;
    modifiedScene: ISceneVariables;
}

export interface ISceneVariables {
    gameName: string;
    sceneObjectsQuantity: number;
    sceneObjects: ISceneObject[];
    sceneBackgroundColor: string;
}
