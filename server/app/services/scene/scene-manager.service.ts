import { inject, injectable } from "inversify";
import { ISceneOptions, SceneType } from "../../../../common/communication/iSceneOptions";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { FormMessage } from "../../../../common/communication/message";
import { Constants } from "../../constants";
import Types from "../../types";
import { CardManagerService } from "../card-manager.service";
import { SceneBuilder } from "./scene-builder";
import { SceneConstants } from "./sceneConstants";

@injectable()
export class SceneManager {

    private sceneBuilder: SceneBuilder;

    public constructor(@inject(Types.CardManagerService) private cardManagerService: CardManagerService) {
        this.sceneBuilder = new SceneBuilder();
    }

    public createScene(body: FormMessage): ISceneVariables | string {

        if (this.cardManagerService.isSceneNameNew(body.gameName)) {
            const iSceneOptions: ISceneOptions = this.sceneOptionsMapper(body);

            return this.sceneBuilder.generateScene(iSceneOptions);
        } else {
            return Constants.CARD_EXISTING;
        }
    }

    private sceneOptionsMapper(body: FormMessage): ISceneOptions {

        // il manque le mapping pour les selected options!!!!!
        // ca sera implementer lorsquon travaille sur les modifications de scenes
        return {
            sceneName: body.gameName,
            sceneType: this.objectTypeIdentifier(body.theme),
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
