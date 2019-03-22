import { ISceneData } from "./iSceneVariables";

export interface ISceneMessage {
    sceneData:     ISceneData<ISceneObject | IMesh>;
    image:         string;
}
