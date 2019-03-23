import { IMesh } from "../../../../../common/communication/iSceneObject";
import { ISceneVariables, IVector3D } from "../../../../../common/communication/iSceneVariables";
// import { CollisionValidator } from "./collision-validator";
import { ISceneOptions } from "../../../../../common/communication/iSceneOptions";
import { ITheme, ISceneEntity } from "../../../../../common/communication/ITheme";
import { SceneConstants } from "../sceneConstants";

export class SceneBuilderTheme {

    private sceneVariables: ISceneVariables<IMesh>;
    // private collisionValidator: CollisionValidator;
    private theme: ITheme;

    public constructor () {
        // this.collisionValidator = new CollisionValidator();
    }

    public generateScene(sceneOptions: ISceneOptions, theme: ITheme): ISceneVariables<IMesh> {
        this.theme = theme;

        this.sceneVariables = {
            theme:                  sceneOptions.sceneType,
            gameName:               sceneOptions.sceneName,
            sceneObjectsQuantity:   sceneOptions.sceneObjectsQuantity,
            sceneObjects:           this.generateSceneObjects(sceneOptions),
            sceneBackgroundColor:   this.theme.backgroundColor,
        };

        return this.sceneVariables;
    }

    private generateSceneObjects(sceneOptions: ISceneOptions): IMesh[] {
        const sceneObjectsQuantity: number = sceneOptions.sceneObjectsQuantity;
        const objects: IMesh[] = [];

        for (let id: number = 0; id < sceneObjectsQuantity; id++) {
            objects.push(this.generateRandomSceneMesh(id, this.theme.sceneEntities));
        }   

        return objects;
    }

    private generateRandomSceneMesh(id: number, sceneEntitiesList: ISceneEntity[]): IMesh {

        const chosenEntity: ISceneEntity = this.getRandomEntity(sceneEntitiesList);
        return this.generateMesh(id, chosenEntity);
    }

    private getRandomEntity(sceneEntities: ISceneEntity[]): ISceneEntity {
        const randomIndex:          number      = Math.random();
        const ratioByIndex:         number[]    = [];
        let   stepValue:            number      = 0;
        let   chosenObjectIndex:    number      = 0;

        sceneEntities.forEach((sceneEntity: ISceneEntity) => {
            ratioByIndex.push(stepValue);
            stepValue += sceneEntity.presenceRatio;
        });

        ratioByIndex.forEach((ratioByIndex: number, index: number) => {
            if (randomIndex < ratioByIndex) {
                chosenObjectIndex = index;
            }
        });

        return sceneEntities[chosenObjectIndex];
    }

    private generateMesh(id: number, sceneEntity: ISceneEntity): IMesh {
        
        return {
            id:             id,
            uuid:           sceneEntity.meshInfos.uuid,
            position:       this.generateRandomPosition(),
            rotation:       {
                x: 0,
                y: this.randomFloatFromInterval(0, SceneConstants.TWO_PI),
                z: 0
            },
            scaleFactor:    this.generateRandomScale(sceneEntity.baseSize),
            hidden:         false,
        } as IMesh;
    }

    private generateRandomPosition(): IVector3D {
        const minPosition: IVector3D = this.theme.generationArea.minPosition;
        const maxPosition: IVector3D = this.theme.generationArea.maxPosition;

        return {
            x: this.randomFloatFromInterval(minPosition.x, maxPosition.x),
            y: this.randomFloatFromInterval(minPosition.y, maxPosition.y),
            z: this.randomFloatFromInterval(minPosition.z, maxPosition.z),
        } as IVector3D;
    }

    private generateRandomScale(baseScale: number): number {
        const minValue: number = baseScale * 0.5;
        const maxValue: number = baseScale * 1.5;
        return this.randomFloatFromInterval(minValue, maxValue);
    }

    private randomFloatFromInterval(min: number, max: number): number {
        return Math.random() * (max - min + 1) + min;
    }

    private validatePosition(position: IVector3D, radius: number): boolean {
        return true;
    }



    // for all  -> generate new id,
    // get in ITheme sceneEntities 
    // generate new size/ pos of entities radisu

}