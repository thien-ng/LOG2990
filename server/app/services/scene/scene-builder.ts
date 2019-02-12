export class SceneBuilder {

    private sceneVariables: ISceneVariables;

    public constructor (public sceneOptions: ISceneOptions) { }

    public generateSceneVariables(sceneOptions: ISceneOptions): void {
        // takes sceneOptions and create the scene variables
    }

    public setSceneObjectsQuantity(): void {

    }

    public generateSceneObjectsTypes(): void {

    }

    public generatePositions(): void {
        
    }

    public generateSceneLights(): void {

    }

    public generateSceneBackgroundColor(): void {

    }

    private randomNumberFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
