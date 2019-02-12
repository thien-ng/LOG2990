import { IAxisValues, IRGBColor, ISceneObject } from "../../../../common/communication/iSceneObject";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneConstants } from "./sceneConstants";

export class SceneBuilder {

    private sceneVariables: ISceneVariables;

    public constructor (public sceneOptions: ISceneOptions) {
        this.sceneVariables.sceneObjectsQuantity = sceneOptions.sceneObjectsQuantity;
        this.sceneVariables.sceneObjects = [];
    }

    public generateSceneVariables(): void {
        this.generateSceneBackgroundColor();
        this.generateSceneObjects();
    }

    // separeted class for object generation needed
    public generateSceneObjects(): void {
        for (let index: number = 0; index < this.sceneVariables.sceneObjectsQuantity; index++) {

            this.sceneVariables.sceneObjects.push(this.generateRandomSceneObject());
        }
    }

    public generateRandomSceneObject(): ISceneObject {
        return {
            type: this.sceneOptions.sceneObjectsType,
            position: this.generateRandomAxisValues(),
            orientation: this.generateRandomAxisValues(),
            scale: this.generateRandomAxisValues(),
            color: this.generateRandomColor(),
        };
    }

    public callFunctionOnAllSceneObjects(func: () => void): void {
        for (let index: number = 0; index < this.sceneVariables.sceneObjectsQuantity; index++) {
            func.call(this);
        }
    }

    // choisi un type d'objet au hasard parmis ceux possibles
    // public generateSceneObjectType(): void {
    //     const randomNumber: number = this.randomNumberFromInterval(0, this.sceneOptions.possibleSceneObjectTypes.length);
    //     this.sceneVariables.sceneObjectsTypes.push(this.sceneOptions.possibleSceneObjectTypes[randomNumber]);
    // }

    public generateRandomAxisValues(): IAxisValues {
        const randomX: number = this.randomNumberFromInterval(0, SceneConstants.MAX_POSITION_X);
        const randomY: number = this.randomNumberFromInterval(0, SceneConstants.MAX_POSITION_Y);
        const randomZ: number = this.randomNumberFromInterval(0, SceneConstants.MAX_POSITION_Z);

        return {
            x: randomX,
            y: randomY,
            z: randomZ,
        };
    }

    public generateSceneBackgroundColor(): void {
        this.sceneVariables.sceneBackgroundColor = this.generateRandomColor();
    }

    public generateRandomColor(): IRGBColor {
        const red: number = this.randomNumberFromInterval(SceneConstants.MIN_COLOR_GRADIENT, SceneConstants.MAX_COLOR_GRADIENT);
        const green: number = this.randomNumberFromInterval(SceneConstants.MIN_COLOR_GRADIENT, SceneConstants.MAX_COLOR_GRADIENT);
        const blue: number = this.randomNumberFromInterval(SceneConstants.MIN_COLOR_GRADIENT, SceneConstants.MAX_COLOR_GRADIENT);

        return {
            red: red,
            green: green,
            blue: blue,
        };
    }

    private randomNumberFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
