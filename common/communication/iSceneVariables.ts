export interface ISceneVariables {
    sceneObjectsQuantity: number;
    sceneObjectsTypes: SceneObjectType[];
    sceneBackgroundColor: RGBColor;
    sceneObjectsPositions: AxisValues[];
    sceneObjectsOrientation: AxisValues[];
    sceneObjectsColors: RGBColor[];
    sceneObjectsScales: AxisValues[];
}

export enum SceneObjectType {
    Sphere,
    Cube,
    Cone,
    Cylinder,
    TriangularPyramid,
}

export interface AxisValues {
    x: number;
    y: number;
    z: number;
}

export interface RGBColor {
    red: number;
    green: number;
    blue: number;
}