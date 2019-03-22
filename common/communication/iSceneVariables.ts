import { SceneType } from "./iSceneOptions";

export interface ISceneData<OBJ3D_T> {
    originalScene:      ISceneVariables<OBJ3D_T>;
    modifiedScene:      ISceneVariables<OBJ3D_T>;
    modifications:      IModification[];
    meshIDs?:           number[];
}

export interface IModification {
    id:                 number;
    type:               ModificationType;
}

export interface ISceneFloor {
    floorObjectUrl:     string;
    floorMaterialUrl:   string;
}

export enum ModificationType {
    added,
    removed,
    changedColor,
  }

export interface ISceneVariables<OBJ3D_T> {
    theme:                  SceneType;
    gameName:               string;
    sceneObjectsQuantity:   number;
    sceneObjects:           OBJ3D_T[];
    sceneBackgroundColor:   string;
    floorObject?:           ISceneFloor;
}

export interface IVector3D {
    x: number;
    y: number;
    z: number;
}
