import { inject, injectable } from "inversify";
import { IMesh, ISceneObject } from "../../../../common/communication/iSceneObject";
import { ISceneOptions, SceneType } from "../../../../common/communication/iSceneOptions";
import { IMeshInfo, IModification, ISceneData, ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { FormMessage } from "../../../../common/communication/message";

import { ISceneEntity, ITheme } from "../../../../common/communication/ITheme";
import { CCommon } from "../../../../common/constantes/cCommon";
import { CServer } from "../../CServer";
import Types from "../../types";
import { AssetManagerService } from "../asset-manager.service";
import { CardManagerService } from "../card-manager.service";
import { SceneBuilder } from "./scene-builder";
import { SceneBuilderTheme } from "./scene-builder-theme";
import { SceneModifier } from "./scene-modifier";
import { SceneModifierTheme } from "./scene-modifier-theme";
import { SceneConstants } from "./sceneConstants";

@injectable()
export class SceneManager {

    private readonly FILE_TO_RECOVER: string = "park.json";

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

        return (this.cardManagerService.isSceneNameNew(formMessage.gameName)) ?
         ((isFormValid) ? this.builderSelector(formMessage) : CServer.CARD_CREATION_ERROR) : CServer.CARD_EXISTING;

    }

    private builderSelector(formMessage: FormMessage): ISceneData<ISceneObject | IMesh> {

        return (formMessage.theme === SceneConstants.TYPE_GEOMETRIC) ?
        this.buildSceneGeometric(formMessage) : this.buildSceneTheme(formMessage);
    }

    private buildSceneGeometric(formMessage: FormMessage): ISceneData<ISceneObject> {

        const modifiedList:             IModification[]                 = [];
        const iSceneOptions:            ISceneOptions                   = this.sceneOptionsMapper(formMessage);
        const generatedOriginalScene:   ISceneVariables<ISceneObject>   = this.sceneBuilderGeometric.generateScene(iSceneOptions);
        const generatedModifiedScene:   ISceneVariables<ISceneObject>   = this.sceneModifierGeometric.modifyScene(  iSceneOptions,
                                                                                                                    generatedOriginalScene,
                                                                                                                    modifiedList);

        return this.buildSceneData(generatedOriginalScene, generatedModifiedScene, modifiedList);
    }

    private buildSceneTheme(formMessage: FormMessage): ISceneData<IMesh> {

        const theme: ITheme = this.assetManagerService.getTheme(this.FILE_TO_RECOVER);

        const modifiedList:             IModification[]          = [];
        const iSceneOptions:            ISceneOptions            = this.sceneOptionsMapper(formMessage);
        const generatedOriginalScene:   ISceneVariables<IMesh>   = this.sceneBuilderTheme.generateScene(iSceneOptions, theme);
        const generatedModifiedScene:   ISceneVariables<IMesh>   = this.sceneModifierTheme.modifyScene( iSceneOptions,
                                                                                                        generatedOriginalScene,
                                                                                                        modifiedList,
                                                                                                        theme.sceneEntities);

        return this.buildSceneData(
            generatedOriginalScene,
            generatedModifiedScene,
            modifiedList,
            this.extractMeshInfos(theme.sceneEntities));
    }

    private extractMeshInfos(sceneEntities: ISceneEntity[]): IMeshInfo[] {
        const meshInfos: IMeshInfo[] = [];

        sceneEntities.forEach((sceneEntity: ISceneEntity) => {
            sceneEntity.meshInfos.forEach((meshInfo: IMeshInfo) => {
                meshInfos.push(meshInfo);
            });
        });

        return meshInfos;
    }

    private buildSceneData<OBJ_T>(
        generatedOriginalScene: ISceneVariables<OBJ_T>,
        generatedModifiedScene: ISceneVariables<OBJ_T>,
        modifiedList:           IModification[],
        meshInfo?:              IMeshInfo[],
        ): ISceneData<OBJ_T> {

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
        return (theme === CServer.THEME_GEOMETRIC || theme === CServer.THEME_THEMATIC);
    }

    private validateQuantity(quantity: number): boolean {
        return (quantity >= CServer.MIN_ITEMS_IN_SCENE && quantity <= CServer.MAX_ITEMS_IN_SCENE);
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
