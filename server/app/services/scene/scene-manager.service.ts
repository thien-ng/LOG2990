import { inject, injectable } from "inversify";
import { SceneObjectType } from "../../../../common/communication/iSceneObject";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";
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
            sceneObjectsType: this.objectTypeIdentifier(body.selectedOption),
            sceneObjectsQuantity: body.quantityChange,
        };
    }

    private objectTypeIdentifier(objectType: string): SceneObjectType {

        let sceneObjectIdentified: SceneObjectType = SceneObjectType.Sphere;

        switch (objectType) {
            case SceneConstants.TYPE_CUBE:
                sceneObjectIdentified = SceneObjectType.Cube;
                break;

            case SceneConstants.TYPE_CONE:
                sceneObjectIdentified = SceneObjectType.Cone;
                break;

            case SceneConstants.TYPE_CYLINDER:
                sceneObjectIdentified = SceneObjectType.Cylinder;
                break;

            case SceneConstants.TYPE_PYRAMID:
                sceneObjectIdentified = SceneObjectType.TriangularPyramid;
                break;

            default:
                sceneObjectIdentified = SceneObjectType.Sphere;
                break;
        }

        return sceneObjectIdentified;
    }

}
