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
            sceneObjectsType: this.objectTypeIdentifier(body.selectedOption),
            sceneObjectsQuantity: body.quantityChange,
        };
    }

    private objectTypeIdentifier(objectType: string): SceneType {

        let sceneObjectIdentified: SceneType;

        switch (objectType) {
            case SceneConstants.TYPE_GEOMETRIC:
                sceneObjectIdentified = SceneType.Geometric;
                break;

            case SceneConstants.TYPE_THEMATIC:
                sceneObjectIdentified = SceneType.Thematic;
                break;

            default:
                sceneObjectIdentified = SceneType.Geometric;
                break;
        }

        return sceneObjectIdentified;
    }

}
