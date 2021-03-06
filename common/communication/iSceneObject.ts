import { IVector3D, IMeshInfo } from "./iSceneVariables";

export interface ISceneObject {
    id:             number;
    type:           SceneObjectType;
    position:       IAxisValues;
    rotation:       IAxisValues;
    color:          string;
    scale:          IAxisValues;
    hidden:         boolean;
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

export interface IMesh {
    id:             number;
    meshInfo:       IMeshInfo;
    name:           string;
    radius:         number;
    position:       IVector3D;
    rotation:       IVector3D;
    scaleFactor:    number;
    hidden:         boolean;
}
