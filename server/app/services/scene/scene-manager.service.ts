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

    public createScene(body: FormMessage): ISceneVariablesMessage | string {

        if (this.cardManagerService.isSceneNameNew(body.gameName)) {
            const iSceneOptions: ISceneOptions = this.sceneOptionsMapper(body);
            const generatedOriginalScene: ISceneVariables = this.sceneBuilder.generateScene(iSceneOptions);
            const generatedModifiedScene: ISceneVariables = this.sceneModifier.modifyScene(iSceneOptions, generatedOriginalScene);

            return {
                originalScene: generatedOriginalScene,
                modifiedScene: generatedModifiedScene,
            } as ISceneVariablesMessage;
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

    private validateName(name: string): boolean{
        const expression: RegExp = new RegExp(Constants.REGEX_FORMAT);

        return (expression.test(name));
    }

    private validateTheme(theme: string): boolean {
        return (theme === THEME_GEOMETRIC || theme === THEME_THEMATIC);
    }
