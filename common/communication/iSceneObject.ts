export interface ISceneObject {
    id:             number;
    type:           SceneObjectType;
    position:       IAxisValues;
    rotation:       IAxisValues;
    color:          string;
    scale:          IAxisValues;
}

export enum SceneObjectType {
    Sphere,
    Cube,
    Cone,
    Cylinder,
    TriangularPyramid,
}

export interface IAxisValues {
    x:  number;
    y:  number;
    z:  number;
}
