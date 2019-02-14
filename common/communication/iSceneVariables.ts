import { ISceneObject } from "./iSceneObject";

export interface ISceneVariables {
    sceneObjectsQuantity: number;
    sceneObjects: ISceneObject[];
    sceneBackgroundColor: string;
}
