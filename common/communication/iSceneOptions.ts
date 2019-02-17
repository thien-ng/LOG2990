import { SceneObjectType } from "./iSceneObject";

export interface ISceneOptions {
    sceneName: string;
    sceneObjectsType: SceneObjectType;
    sceneObjectsQuantity: number;
    selectedOptions: [boolean, boolean, boolean];
}