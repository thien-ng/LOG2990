import { ISceneObject } from "../../../../../common/communication/iSceneObject";

export class CollisionValidator {

    public hasCollidingPositions(newSceneObject: ISceneObject, existingSceneObjects: ISceneObject[]): boolean {

        let hasCollision: boolean = false;

        existingSceneObjects.forEach((element: ISceneObject) => {

            if (this.checkForCollision(newSceneObject, element)) {
                hasCollision =  true;
            }
        });

        return hasCollision;

    }

    private checkForCollision(position1: ISceneObject, position2: ISceneObject): boolean {

        return position1 === position2;
    }

}
