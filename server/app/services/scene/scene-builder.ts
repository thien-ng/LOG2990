import { IAxisValues, ISceneObject } from "../../../../common/communication/iSceneObject";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneConstants } from "./sceneConstants";
import { CollisionValidator } from "./utilitaries/collision-validator";

export class SceneBuilder {

    private sceneVariables: ISceneVariables;
    private collisionValidator: CollisionValidator;

    public constructor () {

        this.collisionValidator = new CollisionValidator();
    }

    public generateScene(sceneOptions: ISceneOptions): ISceneVariables {

        this.sceneVariables = {
            sceneObjectsQuantity: sceneOptions.sceneObjectsQuantity,
            sceneObjects: [],
            sceneBackgroundColor: this.generateRandomColor(),
        };

        this.generateSceneObjects(sceneOptions);

        return this.sceneVariables;
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

    public rgbToHex(r: number, g: number, b: number): string {
        const red: string = r.toString( SceneConstants.HEX_TYPE );
        const green: string = g.toString( SceneConstants.HEX_TYPE );
        const blue: string = b.toString( SceneConstants.HEX_TYPE );

        return SceneConstants.HEX_PREFIX + red + green + blue;
    }

    public randomIntegerFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public randomFloatFromInterval(min: number, max: number): number {
        return Math.random() * (max - min + 1) + min;
    }

    private generateSceneObjects(sceneOptions: ISceneOptions): void {

        const sceneObjectsQuantity: number = sceneOptions.sceneObjectsQuantity;

        for (let index: number = 0; index < sceneObjectsQuantity; index++) {
            this.sceneVariables.sceneObjects.push(this.generateRandomSceneObject(sceneOptions));
        }
    }

    private generateRandomSceneObject(sceneOptions: ISceneOptions): ISceneObject {
        const newSceneObject: ISceneObject = {
            type: sceneOptions.sceneObjectsType,
            position: this.generateRandomAxisValues(),
            rotation: this.generateRandomRotationValues(),
            scale: this.generateRandomScaleValues(),
            color: this.generateRandomColor(),
        };

        this.validatePosition(newSceneObject);

        return newSceneObject;
    }

    private validatePosition(newSceneObject: ISceneObject): void {

        while (this.collisionValidator.hasCollidingPositions(newSceneObject, this.sceneVariables.sceneObjects)) {

            newSceneObject.position = this.generateRandomAxisValues();
        }

    }
}
