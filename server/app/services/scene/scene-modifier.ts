import { ISceneObject } from "../../../../common/communication/iSceneObject";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneBuilder } from "./scene-builder";

export class SceneModifier {

    private sceneBuilder: SceneBuilder;
    private modifiedIndex: number[];
    private sceneObjects: ISceneObject[];
    private sceneOptions: ISceneOptions;

    public constructor(sceneBuilder: SceneBuilder) {
        this.sceneBuilder = sceneBuilder;
        this.modifiedIndex = [];
    }

    public modifyScene(iSceneOptions: ISceneOptions, iSceneVariables: ISceneVariables): ISceneVariables {
        const cloneSceneVariables: ISceneVariables = this.clone(iSceneVariables);
        this.sceneObjects = cloneSceneVariables.sceneObjects;
        this.sceneOptions = iSceneOptions;

        for (let i = 0; i < 7; i++) {
            const generatedIndex: number = this.generateSelectedIndex(iSceneOptions.selectedOptions);

            this.chooseOperation(generatedIndex);
        }

        return cloneSceneVariables;
    }

    private generateSelectedIndex(selectedOptions: boolean[]): number {

        const maxIndex: number = selectedOptions.length;
        const minIndex: number = 1;
        return this.sceneBuilder.randomIntegerFromInterval(maxIndex, minIndex);
    }

    private chooseOperation(selectedOption: number): void {
        console.log(selectedOption);
        switch (selectedOption) {

            case 1:
                console.log("is adding");
                this.addObject();
                break;

            case 2:
                this.removeObject();
                break;

            case 3:
                this.changeObjectColor();
                break;

            default:
                break;
        }
    }

    private addObject(): void {

        const lastObjectElement: ISceneObject = this.sceneObjects[this.sceneObjects.length - 1];
        const newIndex: number = lastObjectElement.id + 1;
        const generatedObject: ISceneObject = this.sceneBuilder.generateRandomSceneObject(newIndex, this.sceneOptions);

        this.modifiedIndex.push(newIndex);
        this.sceneObjects.push(generatedObject);
    }

    private removeObject(): void {
        let generatedIndex: number;

        do {
            generatedIndex = this.generateRandomIndex();
        } while (this.containsInModifedList(generatedIndex) || this.idNotExist(generatedIndex));

        this.sceneObjects = this.sceneObjects.filter((object) => object.id !== generatedIndex);

    }

    private changeObjectColor(): void {

        let generatedIndex: number;

        do {
            generatedIndex = this.generateRandomIndex();
        } while (this.containsInModifedList(generatedIndex) || this.idNotExist(generatedIndex));

        this.modifiedIndex.push(generatedIndex);

        this.sceneObjects.forEach((object) => {
            if (object.id === generatedIndex) {
                object.color = this.sceneBuilder.generateRandomColor();
            }
        });

    }

    private generateRandomIndex(): number {
        const lastObjectElement: ISceneObject = this.sceneObjects[this.sceneObjects.length - 1];
        return this.sceneBuilder.randomIntegerFromInterval(lastObjectElement.id, 0);
    }

    private containsInModifedList(generatedIndex: number): boolean {

        let indexContains: boolean = false;
        this.modifiedIndex.forEach((index) => {
            if (index === generatedIndex) {
                indexContains = true;
            }
        });

        return indexContains;
    }

    private idNotExist(generatedIndex: number): boolean {

        let idNotExist: boolean = true;
        this.sceneObjects.forEach((object) => {
            if (object.id === generatedIndex) {
                idNotExist = false;
            }
        });

        return idNotExist;
    }

    private clone(sceneVariables: ISceneVariables): ISceneVariables {
        const deepcopy = require("deepcopy");
        return deepcopy(sceneVariables);
    }

}
