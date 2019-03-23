import { ISceneEntity, ITheme } from "../../../../common/communication/ITheme";
import { IMesh } from "../../../../common/communication/iSceneObject";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";
import { ISceneVariables, IVector3D } from "../../../../common/communication/iSceneVariables";
import { SceneConstants } from "./sceneConstants";

export class SceneBuilderTheme {

    private readonly MIN_SCALE: number = 0.5;
    private readonly MAX_SCALE: number = 1.5;

    private sceneVariables: ISceneVariables<IMesh>;
    private theme: ITheme;

    public generateScene(sceneOptions: ISceneOptions, theme: ITheme): ISceneVariables<IMesh> {
        this.theme = theme;

        this.sceneVariables = {
            theme:                  sceneOptions.sceneType,
            gameName:               sceneOptions.sceneName,
            sceneObjectsQuantity:   sceneOptions.sceneObjectsQuantity,
            sceneObjects:           [],
            sceneBackgroundColor:   this.theme.backgroundColor,
        };

        this.generateSceneObjects(sceneOptions);

        return this.sceneVariables;
    }

    private generateSceneObjects(sceneOptions: ISceneOptions): void {

        for (let id: number = 0; id < sceneOptions.sceneObjectsQuantity; id++) {
            const generatedObject: IMesh = this.generateRandomSceneMesh(id, this.theme.sceneEntities);
            this.sceneVariables.sceneObjects.push(generatedObject);
        }
    }

    private generateRandomSceneMesh(id: number, sceneEntitiesList: ISceneEntity[]): IMesh {

        const chosenEntity: ISceneEntity = this.getRandomEntity(sceneEntitiesList);

        return this.generateMesh(id, chosenEntity);
    }

    public getRandomEntity(sceneEntities: ISceneEntity[]): ISceneEntity {
        const randomIndex:          number      = Math.random();
        const ratioByIndex:         number[]    = [];
        let   stepValue:            number      = 0;
        let   chosenObjectIndex:    number      = 0;

        sceneEntities.forEach((sceneEntity: ISceneEntity) => {
            ratioByIndex.push(stepValue);
            stepValue += sceneEntity.presenceRatio;
        });

        ratioByIndex.forEach((ratioIndex: number, index: number) => {
            if (randomIndex > ratioIndex) {
                chosenObjectIndex = index;
            }
        });

        return sceneEntities[chosenObjectIndex];
    }

    private generateMesh(id: number, sceneEntity: ISceneEntity): IMesh {
        const scaleFactor:      number = this.generateRandomScale(sceneEntity.baseSize);
        const radius:           number = sceneEntity.radius * scaleFactor;

        return {
            id:             id,
            meshInfo:       sceneEntity.meshInfos[0],
            name:           sceneEntity.name,
            radius:         radius,
            position:       this.generateRandomPosition(radius),
            rotation:       {
                x: 0,
                y: this.randomFloatFromInterval(0, SceneConstants.TWO_PI),
                z: 0,
            },
            scaleFactor:    scaleFactor,
            hidden:         false,
        } as IMesh;
    }

    public generateModifiedMesh(id: number, sceneEntity: ISceneEntity, sceneVariables: ISceneVariables<IMesh>): IMesh {

        this.sceneVariables = sceneVariables;

        const scaleFactor:      number = this.generateRandomScale(sceneEntity.baseSize);
        const radius:           number = sceneEntity.radius * scaleFactor;
        const randomIndex:      number = this.randomIntegerFromInterval(0, sceneEntity.meshInfos.length - 1);

        return {
            id:             id,
            meshInfo:       sceneEntity.meshInfos[randomIndex],
            name:           sceneEntity.name,
            radius:         radius,
            position:       this.generateRandomPosition(radius),
            rotation:       {
                x: 0,
                y: this.randomFloatFromInterval(0, SceneConstants.TWO_PI),
                z: 0,
            },
            scaleFactor:    scaleFactor,
            hidden:         false,
        } as IMesh;
    }

    private generateRandomPosition(radius: number): IVector3D {
        const minPosition: IVector3D = this.theme.generationArea.minPosition;
        const maxPosition: IVector3D = this.theme.generationArea.maxPosition;

        let randomPosition:     IVector3D;
        let isValidPosition:    boolean;

        do {

            randomPosition = {
                x: this.randomFloatFromInterval(minPosition.x, maxPosition.x),
                y: this.randomFloatFromInterval(minPosition.y, maxPosition.y),
                z: this.randomFloatFromInterval(minPosition.z, maxPosition.z),
            } as IVector3D;

            isValidPosition = this.isValidPosition(randomPosition, radius);

        } while (!isValidPosition);

        return randomPosition;
    }

    private generateRandomScale(baseScale: number): number {
        const minValue: number = baseScale * this.MIN_SCALE;
        const maxValue: number = baseScale * this.MAX_SCALE;

        return this.randomFloatFromInterval(minValue, maxValue);
    }

    private randomFloatFromInterval(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public randomIntegerFromInterval(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private isValidPosition(position: IVector3D, radius: number): boolean {

        const sceneObjects: IMesh[] = this.sceneVariables.sceneObjects;

        const isNotValid: boolean = sceneObjects.some((sceneObject: IMesh) => {
            const distanceBetween:      number  = this.getDistanceBetween(position, sceneObject.position);
            const minDistanceNeeded:    number  = radius + sceneObject.radius;

            return distanceBetween < minDistanceNeeded;
        });

        return !isNotValid;
    }

    private getDistanceBetween(vectorFrom: IVector3D, vectorTo: IVector3D): number {
        const deltaX: number = vectorTo.x - vectorFrom.x;
        const deltaY: number = vectorTo.y - vectorFrom.y;
        const deltaZ: number = vectorTo.z - vectorFrom.z;

        return Math.hypot(deltaX, deltaY, deltaZ);
    }

}
