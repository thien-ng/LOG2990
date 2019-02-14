export interface ISceneObject {
    type: SceneObjectType;
    position: IAxisValues;
    orientation: IAxisValues;
    color: string;
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
