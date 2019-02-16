import { IAxisValues, ISceneObject } from "../../../../../common/communication/iSceneObject";
import { SceneConstants } from "../sceneConstants";
import { CollisionBoxGenerator } from "./collision-box-generator";

export class CollisionValidator {

    private collisionBoxGenerator: CollisionBoxGenerator = new CollisionBoxGenerator();

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

        const firstRadius: number   = this.collisionBoxGenerator.generateCollisionRadius(firstSceneObject);
        const secondRadius: number  = this.collisionBoxGenerator.generateCollisionRadius(secondSceneObject);

        const distanceBetweenCenters: number =  this.calculateDistanceBetweenCenters(firstSceneObject.position, secondSceneObject.position);

        return (firstRadius + secondRadius) >= distanceBetweenCenters;
    }

    private calculateDistanceBetweenCenters (firstCenter: IAxisValues, secondCenter: IAxisValues): number {

        const xSqared: number = Math.pow(secondCenter.x - firstCenter.x, SceneConstants.TWO);
        const ySqared: number = Math.pow(secondCenter.y - firstCenter.y, SceneConstants.TWO);
        const zSqared: number = Math.pow(secondCenter.z - firstCenter.z, SceneConstants.TWO);

        return Math.sqrt( xSqared + ySqared + zSqared );
    }

}
