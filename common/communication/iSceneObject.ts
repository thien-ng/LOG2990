export interface ISceneObject {
    type: SceneObjectType;
    position: IAxisValues;
    orientation: IAxisValues;
    color: IRGBColor;
    scale: IAxisValues;
}

export enum SceneObjectType {
    Sphere,
    Cube,
    Cone,
    Cylinder,
    TriangularPyramid,
}

export interface IAxisValues {
    x: number;
    y: number;
    z: number;
}

export interface IRGBColor {
    red: number;
    green: number;
    blue: number;
}