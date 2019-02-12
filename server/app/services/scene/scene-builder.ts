import { AxisValues, ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneConstants } from "./sceneConstants";

export class SceneBuilder {

    private sceneVariables: ISceneVariables;

    public constructor (public sceneOptions: any) {
        this.sceneVariables.sceneObjectsTypes = [];
        this.sceneVariables.sceneObjectsPositions = [];
        this.sceneVariables.sceneObjectsOrientation = [];
        this.sceneVariables.sceneObjectsColors = [];
        this.sceneVariables.sceneObjectsScales = [];
    }

    public generateSceneVariables(sceneOptions: any): void {
        // takes sceneOptions and create the scene variables
    }

    public setSceneObjectsQuantity(): void {
        this.sceneVariables.sceneObjectsQuantity = this.sceneOptions.sceneObjectsQuantity;
    }

    public callFunctionOnAllSceneObjects(func: () => void): void {
        for (let index: number = 0; index < this.sceneVariables.sceneObjectsQuantity; index++) {
            func.call(this);
        }
    }

    // choisi un type d'objet au hasard parmis ceux possibles
    public generateSceneObjectType(): void {
        const randomNumber: number = this.randomNumberFromInterval(0, this.sceneOptions.possibleSceneObjectTypes.length);
        this.sceneVariables.sceneObjectsTypes.push(this.sceneOptions.possibleSceneObjectTypes[randomNumber]);
    }

    public generatePosition(): void {
        const randomPositionX: number = this.randomNumberFromInterval(0, SceneConstants.MAX_POSITION_X);
        const randomPositionY: number = this.randomNumberFromInterval(0, SceneConstants.MAX_POSITION_Y);
        const randomPositionZ: number = this.randomNumberFromInterval(0, SceneConstants.MAX_POSITION_Z);

        const randomPositionVector: AxisValues = {
            x: randomPositionX,
            y: randomPositionY,
            z: randomPositionZ,
        };

        this.sceneVariables.sceneObjectsPositions.push(randomPositionVector);
    }

    public generateSceneLights(): void {
        //
    }

    public generateSceneBackgroundColor(): void {
        //
    }

    private randomNumberFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
