import deepcopy from "ts-deepcopy";
import { ISceneObject } from "../../../../common/communication/iSceneObject";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";
import { IModification, ISceneVariables, ModificationType } from "../../../../common/communication/iSceneVariables";
import { SceneBuilder } from "./scene-builder";
import { SceneConstants } from "./sceneConstants";

export class SceneModifier {

    private readonly LIST_SELECTION_OPTIONS: string[] = ["add", "remove", "changeColor"];
    private readonly NUMBER_ITERATION:       number = 7;

    private sceneBuilder:        SceneBuilder;
    private sceneObjects:        ISceneObject[];
    private originalScene:       ISceneObject[];
    private modifiedIndex:       IModification[];
    private cloneSceneVariables: ISceneVariables;

    public constructor(sceneBuilder: SceneBuilder) {
        this.sceneBuilder = sceneBuilder;
    }

    public modifyScene(iSceneOptions: ISceneOptions, iSceneVariables: ISceneVariables, modifiedList: IModification[]): ISceneVariables {
        this.originalScene       = iSceneVariables.sceneObjects;
        this.cloneSceneVariables = this.clone(iSceneVariables) as ISceneVariables;
        this.sceneObjects        = this.cloneSceneVariables.sceneObjects;
        this.modifiedIndex       = modifiedList;

        for (let i: number = 0; i < this.NUMBER_ITERATION; i++) {
            const selectedOpstion: string = this.generateSelectedIndex(iSceneOptions.selectedOptions);

            this.chooseOperation(selectedOpstion);
        }

        return {
            gameName: this.cloneSceneVariables.gameName,
            sceneObjectsQuantity: this.cloneSceneVariables.sceneObjectsQuantity,
            sceneObjects: this.sceneObjects,
            sceneBackgroundColor: this.cloneSceneVariables.sceneBackgroundColor,
        } as ISceneVariables;
    }

    private generateSelectedIndex(selectedOptions: boolean[]): string {
        const listSelected: string [] = [];

        selectedOptions.forEach((option: boolean, index: number) => {
            if (option) {
                listSelected.push(this.LIST_SELECTION_OPTIONS[index]);
            }
        });
        const maxIndex: number = listSelected.length - 1;
        const MIN_INDEX: number = 0;
        const generatedIndex: number = this.sceneBuilder.randomIntegerFromInterval(MIN_INDEX, maxIndex);

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

        const lastObjectElement:            ISceneObject = this.sceneObjects[this.sceneObjects.length - 1];
        const newIndex:                     number       = lastObjectElement.id + 1;
        const generatedObject:              ISceneObject = this.sceneBuilder.generateModifyObject(newIndex, this.cloneSceneVariables);
        const generatedObjectForOriginal:   ISceneObject = this.clone(generatedObject) as ISceneObject;

        generatedObjectForOriginal.hidden = true;

        const modificationMap: IModification = {id: newIndex, type: ModificationType.added};

        this.modifiedIndex.push(modificationMap);
        this.sceneObjects.push(generatedObject);
        this.originalScene.push(generatedObjectForOriginal);
    }

    private removeObject(): void {
        let generatedIndex: number;

        do {
            generatedIndex = this.generateRandomIndex();
        } while (this.containsInModifedList(generatedIndex) || this.idNotExist(generatedIndex));

        const objectArray: ISceneObject[] = this.sceneObjects.filter((object: ISceneObject) => object.id === generatedIndex);
        objectArray[0].hidden = true;

        const modificationMap: IModification = {id: generatedIndex, type: ModificationType.removed};

        this.modifiedIndex.push(modificationMap);
    }

    private changeObjectColor(): void {

        let generatedIndex: number;

        do {
            generatedIndex = this.generateRandomIndex();
        } while (this.containsInModifedList(generatedIndex) || this.idNotExist(generatedIndex));

        const modificationMap: IModification = {id: generatedIndex, type: ModificationType.changedColor};
        this.modifiedIndex.push(modificationMap);

        this.sceneObjects.forEach((object: ISceneObject) => {
            if (object.id === generatedIndex) {
                object.color = this.sceneBuilder.generateRandomColor();
            }
        });

    }

    private generateRandomIndex(): number {
        const lastObjectElement: ISceneObject = this.sceneObjects[this.sceneObjects.length - 1];
        const MIN_INDEX_VALUE: number = 0;

        return this.sceneBuilder.randomIntegerFromInterval(MIN_INDEX_VALUE, lastObjectElement.id);
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
        this.sceneObjects.forEach((object: ISceneObject) => {
            if (object.id === generatedIndex) {
                idNotExist = false;
            }
        });

        return idNotExist;
    }

    private clone(sceneVariables: ISceneVariables | ISceneObject): ISceneVariables | ISceneObject {
        return deepcopy<ISceneVariables | ISceneObject>(sceneVariables);
    }

}
