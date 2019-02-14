import { stringify } from "querystring";
import { IAxisValues, ISceneObject } from "../../../../common/communication/iSceneObject";
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
            rotation: this.generateRandomRotationValues(),
            scale: this.generateRandomScaleValues(),
            color: this.generateRandomColor(),
        };
    }

    public generateRandomAxisValues(): IAxisValues {
        const randomX: number = this.randomIntegerFromInterval(0, SceneConstants.MAX_POSITION_X);
        const randomY: number = this.randomIntegerFromInterval(0, SceneConstants.MAX_POSITION_Y);
        const randomZ: number = this.randomIntegerFromInterval(0, SceneConstants.MAX_POSITION_Z);

        return {
            x: randomX,
            y: randomY,
            z: randomZ,
        };
    }

    public generateRandomRotationValues(): IAxisValues {
        const randomRadX: number = this.randomFloatFromInterval(0, SceneConstants.TWO_PI);
        const randomRadY: number = this.randomFloatFromInterval(0, SceneConstants.TWO_PI);
        const randomRadZ: number = this.randomFloatFromInterval(0, SceneConstants.TWO_PI);

        return {
            x: randomRadX,
            y: randomRadY,
            z: randomRadZ,
        };
    }

    public generateRandomScaleValues(): IAxisValues {
        const randomX: number = this.randomIntegerFromInterval(SceneConstants.MIN_SCALE, SceneConstants.MAX_SCALE);
        const randomY: number = this.randomIntegerFromInterval(SceneConstants.MIN_SCALE, SceneConstants.MAX_SCALE);
        const randomZ: number = this.randomIntegerFromInterval(SceneConstants.MIN_SCALE, SceneConstants.MAX_SCALE);

        return {
            x: randomX,
            y: randomY,
            z: randomZ,
        };
    }

    public generateRandomColor(): string {
        const red: number = this.randomIntegerFromInterval(SceneConstants.MIN_COLOR_GRADIENT, SceneConstants.MAX_COLOR_GRADIENT);
        const green: number = this.randomIntegerFromInterval(SceneConstants.MIN_COLOR_GRADIENT, SceneConstants.MAX_COLOR_GRADIENT);
        const blue: number = this.randomIntegerFromInterval(SceneConstants.MIN_COLOR_GRADIENT, SceneConstants.MAX_COLOR_GRADIENT);

        return this.rgbToHex(red, green, blue);
    }

    private rgbToHex(r: number, g: number, b: number): string {
        const red: string = stringify(r, SceneConstants.HEX_TYPE);
        const green: string = stringify(r, SceneConstants.HEX_TYPE);
        const blue: string = stringify(r, SceneConstants.HEX_TYPE);

        return SceneConstants.HEX_PREFIX + red + green + blue;
    }

    private randomIntegerFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private randomFloatFromInterval(min: number, max: number): number {
        return Math.random() * (max - min + 1) + min;
    }
}
