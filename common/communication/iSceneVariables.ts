import { ISceneObject } from "./iSceneObject";

export interface ISceneVariables {
    gameName: string;
    sceneObjectsQuantity: number;
    sceneObjects: ISceneObject[];
    sceneBackgroundColor: string;
}
