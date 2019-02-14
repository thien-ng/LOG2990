import { IAxisValues, IRGBColor, ISceneObject } from "../../../../common/communication/iSceneObject";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneConstants } from "./sceneConstants";

export class SceneBuilder {

    private sceneVariables: ISceneVariables;

    public constructor (public sceneOptions: ISceneOptions) {
        this.sceneVariables = {
            sceneObjectsQuantity: sceneOptions.sceneObjectsQuantity,
            sceneObjects: [],
            sceneBackgroundColor: this.generateRandomColor(),
        };

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
            scale: this.generateRandomScaleValues(),
            color: this.generateRandomColor(),
        };
    }

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

    public generateRandomScaleValues(): IAxisValues {
        const randomX: number = this.randomNumberFromInterval(SceneConstants.MIN_SCALE, SceneConstants.MAX_SCALE);
        const randomY: number = this.randomNumberFromInterval(SceneConstants.MIN_SCALE, SceneConstants.MAX_SCALE);
        const randomZ: number = this.randomNumberFromInterval(SceneConstants.MIN_SCALE, SceneConstants.MAX_SCALE);

        return {
            x: randomX,
            y: randomY,
            z: randomZ,
        };
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
