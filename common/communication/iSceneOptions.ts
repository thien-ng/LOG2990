
export enum SceneType {
    Geometric,
    Thematic,
}

export interface ISceneOptions {
    sceneName: string;
    sceneType: SceneType;
    sceneObjectsQuantity: number;
    selectedOptions: [boolean, boolean, boolean];
}