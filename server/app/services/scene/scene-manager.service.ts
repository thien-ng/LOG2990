import { injectable } from "inversify";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";
import { FormMessage } from "../../../../common/communication/message";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneObjectType } from "../../../../common/communication/iSceneObject";
import { SceneBuilder } from "./scene-builder";

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

    private objectTypeIdentifier(objectType: string): SceneObjectType {

        switch(objectType) {
            case "cube":
                return SceneObjectType.Cube;

            case "cone":
                return SceneObjectType.Cone;

            case "cylinder":
                return SceneObjectType.Cylinder;

            case "pyramid":
                return SceneObjectType.TriangularPyramid;

            default:
                return SceneObjectType.Sphere;
        }
    }



}
