import { ISceneObject, IRGBColor } from "./iSceneObject";

export interface ISceneVariables {
    sceneObjectsQuantity: number;
    sceneObjects: ISceneObject[];
    sceneBackgroundColor: IRGBColor;
}
