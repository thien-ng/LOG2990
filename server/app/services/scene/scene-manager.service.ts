import { inject, injectable } from "inversify";
import { ISceneObject, IMesh } from "../../../../common/communication/iSceneObject";
import { ISceneOptions, SceneType } from "../../../../common/communication/iSceneOptions";
import { IModification, ISceneData, ISceneVariables, IMeshInfo } from "../../../../common/communication/iSceneVariables";
import { FormMessage } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";
import { Constants } from "../../constants";
import Types from "../../types";
import { CardManagerService } from "../card-manager.service";
import { SceneBuilder } from "./scene-builder";
import { SceneModifier } from "./scene-modifier";
import { SceneConstants } from "./sceneConstants";
import { SceneBuilderTheme } from "./scene-builder-theme";
import { AssetManagerService } from "../asset-manager.service";
import { ITheme } from "../../../../common/communication/ITheme";
import { SceneModifierTheme } from "./scene-modifier-theme";

@injectable()
export class SceneManager {

    private sceneBuilderGeometric:      SceneBuilder;
    private sceneBuilderTheme:          SceneBuilderTheme;
    private sceneModifierGeometric:     SceneModifier;
    private sceneModifierTheme:         SceneModifierTheme;

    public constructor(
        @inject(Types.CardManagerService)   private cardManagerService:     CardManagerService,
        @inject(Types.AssetManagerService)  private assetManagerService:    AssetManagerService) {

        this.sceneBuilderGeometric  = new SceneBuilder();
        this.sceneBuilderTheme      = new SceneBuilderTheme();
        this.sceneModifierGeometric = new SceneModifier(this.sceneBuilderGeometric);
        this.sceneModifierTheme     = new SceneModifierTheme(this.sceneBuilderTheme);
        
    }

    public createScene(formMessage: FormMessage): ISceneData<ISceneObject | IMesh> | string {

        const isFormValid: boolean = this.validateForm(formMessage);

        if (this.cardManagerService.isSceneNameNew(formMessage.gameName)) {
            if (isFormValid) {
                return this.builderSelector(formMessage);
            } else {
                return Constants.CARD_CREATION_ERROR;
            }
        } else {
            return Constants.CARD_EXISTING;
        }
    }

    private builderSelector(formMessage: FormMessage): ISceneData<ISceneObject | IMesh> | string {

        if (formMessage.theme === undefined) {
            return "Theme doesn't exist.";
        }

        if (formMessage.theme === SceneConstants.TYPE_GEOMETRIC) {
            return this.buildSceneGeometric(formMessage);
        } else if (formMessage.theme === SceneConstants.TYPE_THEMATIC) {
            return this.buildSceneTheme(formMessage);
        } else {
            return "Wrong Type.";
        }
    }

    private buildSceneGeometric(formMessage: FormMessage): ISceneData<ISceneObject> {

        const modifiedList:             IModification[]                 = [];
        const iSceneOptions:            ISceneOptions                   = this.sceneOptionsMapper(formMessage);
        const generatedOriginalScene:   ISceneVariables<ISceneObject>   = this.sceneBuilderGeometric.generateScene(iSceneOptions);
        const generatedModifiedScene:   ISceneVariables<ISceneObject>   = this.sceneModifierGeometric.modifyScene(iSceneOptions,
                                                                                                     generatedOriginalScene,
                                                                                                     modifiedList);

        return this.buildSceneData(generatedOriginalScene, generatedModifiedScene, modifiedList);
    }

    private buildSceneTheme(formMessage: FormMessage): ISceneData<IMesh> {

        const theme: ITheme = this.assetManagerService.getTheme("parktest.json");

        const modifiedList:             IModification[]                 = [];
        const iSceneOptions:            ISceneOptions                   = this.sceneOptionsMapper(formMessage);
        const generatedOriginalScene:   ISceneVariables<IMesh>   = this.sceneBuilderTheme.generateScene(iSceneOptions, theme);

        // _TODO
        const generatedModifiedScene:   ISceneVariables<IMesh>   = this.sceneModifierTheme.modifyScene(iSceneOptions,
                                                                                                     generatedOriginalScene,
                                                                                                     modifiedList,
                                                                                                     theme.sceneEntities);
        return this.buildSceneData(generatedOriginalScene, generatedModifiedScene, modifiedList);
    }

    private buildSceneData<OBJ_T>(
        generatedOriginalScene: ISceneVariables<OBJ_T>,
        generatedModifiedScene: ISceneVariables<OBJ_T>,
        modifiedList:           IModification[],
        meshInfo?:              IMeshInfo[]             ): ISceneData<OBJ_T> {

        return {
            originalScene:  generatedOriginalScene,
            modifiedScene:  generatedModifiedScene,
            modifications:  modifiedList,
            meshInfos:      meshInfo,
        } as ISceneData<OBJ_T>;
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
        const expression: RegExp = new RegExp(CCommon.REGEX_PATTERN_ALPHANUM);

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
