import { IAxisValues, ISceneObject } from "../../../../../common/communication/iSceneObject";
import { SceneConstants } from "../sceneConstants";
import { CollisionBoxGenerator } from "./collision-box-generator";

export class CollisionValidator {

    private collisionBoxGenerator: CollisionBoxGenerator;

    public constructor() {
    public hasCollidingPositions(newSceneObject: ISceneObject, existingSceneObjects: ISceneObject[]): boolean {

        let hasCollision: boolean = false;
        existingSceneObjects.forEach((element: ISceneObject) => {

            if (this.checkForCollision(newSceneObject, element)) {
                hasCollision =  true;
            }
        });

        return hasCollision;

    }

    private checkForCollision(firstSceneObject: ISceneObject, secondSceneObject: ISceneObject): boolean {

        const firstRadius:            number = this.collisionBoxGenerator.generateCollisionRadius(firstSceneObject);
        const secondRadius:           number = this.collisionBoxGenerator.generateCollisionRadius(secondSceneObject);
        const distanceBetweenCenters: number = this.calculateDistanceBetweenCenters(firstSceneObject.position, secondSceneObject.position);

        return (firstRadius + secondRadius) >= (distanceBetweenCenters + SceneConstants.DISTANCE_OFFSET);
    }

    private calculateDistanceBetweenCenters (firstCenter: IAxisValues, secondCenter: IAxisValues): number {

        const xMedian: number = secondCenter.x - firstCenter.x;
        const yMedian: number = secondCenter.y - firstCenter.y;
        const zMedian: number = secondCenter.z - firstCenter.z;

        return this.collisionBoxGenerator.pythagore( [xMedian, yMedian, zMedian] );
    }

}
