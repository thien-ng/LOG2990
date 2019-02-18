
export enum SceneType {
    Geometric,
    Thematic,
}

export interface ISceneOptions {
    sceneName: string;
    sceneObjectsType: SceneType;
    sceneObjectsQuantity: number;
}