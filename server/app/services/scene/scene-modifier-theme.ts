import deepcopy from "ts-deepcopy";
import { ISceneEntity } from "../../../../common/communication/ITheme";
import { IMesh } from "../../../../common/communication/iSceneObject";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";
import { IModification, ISceneVariables, ModificationType } from "../../../../common/communication/iSceneVariables";
import { SceneBuilderTheme } from "./scene-builder-theme";
import { SceneConstants } from "./sceneConstants";

export class SceneModifierTheme {

    private readonly LIST_SELECTION_OPTIONS: string[] = ["add", "remove", "changeColor"];
    private readonly NUMBER_ITERATION:       number = 7;

    private sceneBuilderTheme:      SceneBuilderTheme;
    private sceneObjects:           IMesh[];
    private originalObjects:        IMesh[];
    private modifiedIndex:          IModification[];
    private sceneEntities:          ISceneEntity[];
    private cloneSceneVariables:    ISceneVariables<IMesh>;

    public constructor(sceneBuilderTheme: SceneBuilderTheme) {
        this.sceneBuilderTheme = sceneBuilderTheme;
    }

    public modifyScene(
        sceneOptions:      ISceneOptions,
        sceneVariables:    ISceneVariables<IMesh>,
        modifications:     IModification[],
        sceneEntities:     ISceneEntity[]): ISceneVariables<IMesh> {

        this.originalObjects = sceneVariables.sceneObjects;
        this.cloneSceneVariables = this.clone<ISceneVariables<IMesh>>(sceneVariables);
        this.sceneObjects = this.cloneSceneVariables.sceneObjects;
        this.modifiedIndex = modifications;
        this.sceneEntities = sceneEntities;

        for (let i: number = 0; i < this.NUMBER_ITERATION; i++) {
            const selectedOption: string = this.generateSelectedIndex(sceneOptions.selectedOptions);

            this.chooseOperation(selectedOption);
        }

        return {
            gameName:               this.cloneSceneVariables.gameName,
            sceneObjectsQuantity:   this.cloneSceneVariables.sceneObjectsQuantity,
            sceneObjects:           this.sceneObjects,
            sceneBackgroundColor:   this.cloneSceneVariables.sceneBackgroundColor,
        } as ISceneVariables<IMesh>;
    }

    private generateSelectedIndex(selectedOptions: boolean[]): string {
        const listSelected: string [] = [];

        selectedOptions.forEach((option: boolean, index: number) => {
            if (option) {
                listSelected.push(this.LIST_SELECTION_OPTIONS[index]);
            }
        });
        const maxIndex:         number = listSelected.length - 1;
        const MIN_INDEX:        number = 0;
        const generatedIndex:   number = this.sceneBuilderTheme.randomIntegerFromInterval(MIN_INDEX, maxIndex);

        return listSelected[generatedIndex];
    }

    private chooseOperation(selectedOption: string): void {

        switch (selectedOption) {

            case SceneConstants.OPTION_ADD:
                this.addObject();
                break;

            case SceneConstants.OPTION_REMOVE:
                this.removeObject();
                break;

            case SceneConstants.OPTION_CHANGE_COLOR:
                this.changeObjectColor();
                break;

            default:
                break;
        }
    }

    private addObject(): void {
        const lastObjectElement:        IMesh   = this.sceneObjects[this.sceneObjects.length - 1];
        const newIndex:                 number  = lastObjectElement.id + 1;
        const randomEntity:             ISceneEntity = this.sceneBuilderTheme.getRandomEntity(this.sceneEntities);
        const generatedMesh:            IMesh   = this.sceneBuilderTheme.generateModifiedMesh(newIndex,
                                                                                              randomEntity,
                                                                                              this.cloneSceneVariables);
        const generatedMeshForOriginal: IMesh   = this.clone<IMesh>(generatedMesh);

        generatedMeshForOriginal.hidden = true;
        const modificationMap: IModification = {id: newIndex, type: ModificationType.added};
        this.modifiedIndex.push(modificationMap);
        this.sceneObjects.push(generatedMesh);
        this.originalObjects.push(generatedMeshForOriginal);
    }

    private removeObject(): void {
        let generatedIndex: number;

        do {
            generatedIndex = this.generateRandomIndex();
        } while (this.containsInModifedList(generatedIndex) || this.idNotExist(generatedIndex));

        const objectArray: IMesh[] = this.sceneObjects.filter((object: IMesh) => object.id === generatedIndex);
        objectArray[0].hidden = true;

        const modificationMap: IModification = {id: generatedIndex, type: ModificationType.removed};

        this.modifiedIndex.push(modificationMap);
    }

    private changeObjectColor(): void {

        let generatedIndex: number;

        do {
            generatedIndex = this.generateRandomIndex();
        } while (this.containsInModifedList(generatedIndex) || this.idNotExist(generatedIndex));

        const foundMesh: IMesh | undefined = this.sceneObjects.find((object: IMesh) => {
            return object.id === generatedIndex;
        });

        if (foundMesh) {
            const foundEntity: ISceneEntity | undefined = this.findEntityByUUID(foundMesh.name);

            if (foundEntity) {

                foundMesh.meshInfo = foundEntity.meshInfos[1];
                const modificationMap: IModification = {id: generatedIndex, type: ModificationType.changedColor};
                this.modifiedIndex.push(modificationMap);
            }

        }

    }

    private findEntityByUUID(entityName: string): ISceneEntity | undefined {

        return this.sceneEntities.find((sceneEntity: ISceneEntity) => {
            return sceneEntity.name === entityName;
        });
    }

    private generateRandomIndex(): number {
        const lastObjectElement:    IMesh = this.sceneObjects[this.sceneObjects.length - 1];
        const MIN_INDEX_VALUE:      number = 0;

        return this.sceneBuilderTheme.randomIntegerFromInterval(MIN_INDEX_VALUE, lastObjectElement.id);
    }

    private containsInModifedList(generatedIndex: number): boolean {
        let indexContains: boolean = false;
        this.modifiedIndex.forEach((elementMap: IModification) => {
            if (elementMap.id === generatedIndex) {
                indexContains = true;
            }
        });

        return indexContains;
    }

    private idNotExist(generatedIndex: number): boolean {

        let idNotExist: boolean = true;
        this.sceneObjects.forEach((object: IMesh) => {
            if (object.id === generatedIndex) {
                idNotExist = false;
            }
        });

        return idNotExist;
    }

    private clone<T>(objectToClone: T): T {
        return deepcopy<T>(objectToClone);
    }

}
