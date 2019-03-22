import { ISceneObject } from "./iSceneObject";
import { SceneType } from "./iSceneOptions";

export interface ISceneData {
    originalScene:      ISceneVariables;
    modifiedScene:      ISceneVariables;
    modifications:      IModification[];
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
