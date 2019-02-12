export interface ISceneVariables {
    sceneObjectsQuantity: number;
    sceneObjectsTypes: SceneObjectType[];
    sceneBackgroundColor: RGBColor;
    sceneObjectsPositions: axisValues[];
    sceneObjectsOrientation: axisValues[];
    sceneObjectsColors: RGBColor[];
    sceneObjectsScales: axisValues[];
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

export interface RGBColor {
    red: number;
    green: number;
    blue: number;
}