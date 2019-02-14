import { IAxisValues, ISceneObject } from "../../../../../common/communication/iSceneObject";

export class CollisionValidator {

    public hasCollidingPositions(newSceneObject: ISceneObject, existingSceneObjects: ISceneObject[]): boolean {

        let hasCollision: boolean = false;

        existingSceneObjects.forEach((element: ISceneObject) => {

            if (this.areColliding(newSceneObject.position, element.position)) {
                // hasCollision =  true;
                return true;
            }
        });
        return false;

    }

    private areColliding(position1: IAxisValues, position2: IAxisValues): boolean {

        return position1 === position2;
    }
}