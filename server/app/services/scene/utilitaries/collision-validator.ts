import { IAxisValues, ISceneObject } from "../../../../../common/communication/iSceneObject";
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

        // firstSceneObject.position = secondSceneObject.position;

        const firstRadius: number   = this.collisionBoxGenerator.generateCollisionRadius(firstSceneObject);
        const secondRadius: number  = this.collisionBoxGenerator.generateCollisionRadius(secondSceneObject);

        const distanceBetweenCenters: number =  this.calculateDistanceBetweenCenters(firstSceneObject.position, secondSceneObject.position);

        return (firstRadius + secondRadius) >= distanceBetweenCenters;
    }

    public calculateDistanceBetweenCenters (firstCenter: IAxisValues, secondCenter: IAxisValues): number {

        // tslint:disable-next-line:no-magic-numbers
        const xSqared: number = Math.pow(secondCenter.x - firstCenter.x, 2);
        // tslint:disable-next-line:no-magic-numbers
        const ySqared: number = Math.pow(secondCenter.y - firstCenter.y, 2);
        // tslint:disable-next-line:no-magic-numbers
        const zSqared: number = Math.pow(secondCenter.z - firstCenter.z, 2);

        return Math.sqrt( xSqared + ySqared + zSqared );
    }

}
