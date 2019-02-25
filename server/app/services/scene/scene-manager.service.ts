import { inject, injectable } from "inversify";
import { ISceneOptions, SceneType } from "../../../../common/communication/iSceneOptions";
import { ISceneVariables, ISceneVariablesMessage } from "../../../../common/communication/iSceneVariables";
import { FormMessage } from "../../../../common/communication/message";
import { Constants } from "../../constants";
import Types from "../../types";
import { CardManagerService } from "../card-manager.service";
import { SceneBuilder } from "./scene-builder";
import { SceneModifier } from "./scene-modifier";
import { SceneConstants } from "./sceneConstants";

@injectable()
export class SceneManager {

    private sceneBuilder: SceneBuilder;
    private sceneModifier: SceneModifier;

    public constructor(@inject(Types.CardManagerService) private cardManagerService: CardManagerService) {
        this.sceneBuilder = new SceneBuilder();
        this.sceneModifier = new SceneModifier(this.sceneBuilder);
    }

    public createScene(formMessage: FormMessage): ISceneVariablesMessage | string {

        const isFormValid: boolean = this.validateForm(formMessage);

        if (this.cardManagerService.isSceneNameNew(formMessage.gameName)) {
            if (isFormValid){
                const iSceneOptions: ISceneOptions = this.sceneOptionsMapper(formMessage);
                const generatedOriginalScene: ISceneVariables = this.sceneBuilder.generateScene(iSceneOptions);
                const generatedModifiedScene: ISceneVariables = this.sceneModifier.modifyScene(iSceneOptions, generatedOriginalScene);

                return {
                    originalScene: generatedOriginalScene,
                    modifiedScene: generatedModifiedScene,
                } as ISceneVariablesMessage;
            } else {
                return Constants.CARD_CREATION_ERROR;
            }
        } else {
            return Constants.CARD_EXISTING;
        }
    }

    private sceneOptionsMapper(body: FormMessage): ISceneOptions {

        return {
            sceneName: body.gameName,
            sceneType: this.objectTypeIdentifier(body.theme),
            sceneObjectsQuantity: body.quantityChange,
            selectedOptions: body.checkedTypes,
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

    private validateForm(form: FormMessage): boolean {
        return  this.validateName(form.gameName) &&
                this.validateTheme(form.theme) &&
                this.validateQuantity(form.quantityChange) &&
                this.validateCheckedTypes(form.checkedTypes);
    }

    private validateName(name: string): boolean {
        const expression: RegExp = new RegExp(Constants.REGEX_FORMAT);

        return (expression.test(name));
    }

    private validateTheme(theme: string): boolean {
        return (theme === Constants.THEME_GEOMETRIC || theme === Constants.THEME_THEMATIC);
    }

    private validateQuantity(quantity: number): boolean {
        return (quantity >= Constants.MIN_ITEMS_IN_SCENE && quantity <= Constants.MAX_ITEMS_IN_SCENE);
    }

    private validateCheckedTypes(list: [boolean, boolean, boolean]): boolean {
        let isAtLeastOneChecked: boolean = false;
        list.forEach((element: boolean) => {
            if (element) {
                isAtLeastOneChecked = true;
            }
        });

        return isAtLeastOneChecked;
    }
}
