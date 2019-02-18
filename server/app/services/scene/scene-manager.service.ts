import { injectable } from "inversify";
import { SceneObjectType } from "../../../../common/communication/iSceneObject";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";
import { ISceneVariables, ISceneVariablesMessage } from "../../../../common/communication/iSceneVariables";
import { FormMessage } from "../../../../common/communication/message";
import { SceneBuilder } from "./scene-builder";
import { SceneModifier } from "./scene-modifier";
import { SceneConstants } from "./sceneConstants";

@injectable()
export class SceneManager {

    private sceneBuilder: SceneBuilder;
    private sceneModifier: SceneModifier;

    public constructor() {
        this.sceneBuilder = new SceneBuilder();
        this.sceneModifier = new SceneModifier(this.sceneBuilder);
    }

    public createScene(body: FormMessage): ISceneVariablesMessage {

        const iSceneOptions: ISceneOptions = this.sceneOptionsMapper(body);
        const generatedOriginalScene: ISceneVariables = this.sceneBuilder.generateScene(iSceneOptions);
        const generatedModifiedScene: ISceneVariables = this.sceneModifier.modifyScene(iSceneOptions, generatedOriginalScene);
        return {
            originalScene: generatedOriginalScene,
            modifiedScene: generatedModifiedScene,
        } as ISceneVariablesMessage;
    }

    private sceneOptionsMapper(body: FormMessage): ISceneOptions {

        return {
            sceneName: body.gameName,
            sceneObjectsType: this.objectTypeIdentifier(body.selectedOption),
            sceneObjectsQuantity: body.quantityChange,
            selectedOptions: body.checkedTypes,
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
