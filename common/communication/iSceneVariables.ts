export interface ISceneVariables {
    sceneObjectsQuantity: number;
    sceneObjectsTypes: SceneObjectType[];
    sceneObjectsPositions: axisValues[];
    sceneObjectsScales: axisValues[];
    sceneObjectsRotation: axisValues[];
}

export enum SceneObjectType {
    Sphere,
    Cube,
    Cone,
    Cylinder,
    TriangularPyramid,
}

export interface axisValues {
    x: number;
    y: number;
    z: number;
}