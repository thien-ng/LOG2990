import { IMesh } from "../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../common/communication/iSceneVariables";
import { CollisionValidator } from "./collision-validator";
import { ISceneOptions } from "../../../../../common/communication/iSceneOptions";

export class SceneBuilderTheme {

    private sceneVariables: ISceneVariables<IMesh>;
    private collisionValidator: CollisionValidator;

    public constructor () {
        this.collisionValidator = new CollisionValidator();
    }

    public generateScene(sceneOptions: ISceneOptions): ISceneVariables<IMesh> {

        this.sceneVariables = {
            theme: sceneOptions.sceneType,
            gameName: sceneOptions.sceneName,
            sceneObjectsQuantity: sceneOptions.sceneObjectsQuantity,
            sceneObjects: [],
            sceneBackgroundColor: "#FFFFFF",
        };

        return this.sceneVariables;
    }

    
}