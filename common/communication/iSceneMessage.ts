import { ISceneData } from "./iSceneVariables";
import { IMesh, ISceneObject } from "./iSceneObject";

export interface ISceneMessage {
    sceneData:     ISceneData<ISceneObject | IMesh>;
    image:         string;
}
