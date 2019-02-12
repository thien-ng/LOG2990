import { ISceneVariables } from "../../../../common/communication/iSceneVariables";

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

    public generateSceneObjectsTypes(): void {
        //
    }

    public generatePositions(): void {
        //
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
