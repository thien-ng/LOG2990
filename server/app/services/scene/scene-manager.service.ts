import { injectable } from "inversify";
import { ISceneOptions, SceneType } from "../../../../common/communication/iSceneOptions";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { FormMessage } from "../../../../common/communication/message";
import { SceneBuilder } from "./scene-builder";
import { SceneConstants } from "./sceneConstants";

@injectable()
export class SceneManager {

    private sceneBuilder: SceneBuilder;

    public constructor() {
        this.sceneBuilder = new SceneBuilder();
    }

    public createScene(body: FormMessage): ISceneVariables {

        const iSceneOptions: ISceneOptions = this.sceneOptionsMapper(body);

        return this.sceneBuilder.generateScene(iSceneOptions);
    }

    private sceneOptionsMapper(body: FormMessage): ISceneOptions {

        // il manque le mapping pour les selected options!!!!!
        // ca sera implementer lorsquon travaille sur les modifications de scenes
        return {
            sceneName: body.gameName,
            sceneType: this.objectTypeIdentifier(body.selectedOption),
            sceneObjectsQuantity: body.quantityChange,
        };
    }

    private objectTypeIdentifier(objectType: string): SceneType {

        let sceneTypeIdentified: SceneType;

        switch (objectType) {
            case SceneConstants.TYPE_GEOMETRIC:
                sceneTypeIdentified = SceneType.Geometric;
                break;

            case SceneConstants.TYPE_THEMATIC:
                sceneTypeIdentified = SceneType.Thematic;
                break;

            default:
                sceneTypeIdentified = SceneType.Geometric;
                break;
        }

        return sceneTypeIdentified;
    }

}
