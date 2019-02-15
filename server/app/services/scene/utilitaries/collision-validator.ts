import { IAxisValues, ISceneObject, SceneObjectType } from "../../../../../common/communication/iSceneObject";

export class CollisionValidator {

    public hasCollidingPositions(newSceneObject: ISceneObject, existingSceneObjects: ISceneObject[]): boolean {

        let hasCollision: boolean = false;

        existingSceneObjects.forEach((element: ISceneObject) => {

            if (this.areColliding(newSceneObject.position, element.position)) {
                hasCollision =  true;
            }
        });

        return hasCollision;

    }

    private areColliding(position1: IAxisValues, position2: IAxisValues): boolean {

        return position1 === position2;
    }

    public generateCollisionRadius(sceneObject: ISceneObject): number {

        let radius: number;

        switch (sceneObject.type) {
            case SceneObjectType.Cube:
                radius = 0;
                break;

            case SceneObjectType.Cylinder:
                radius = 0;
                break;

            case SceneObjectType.TriangularPyramid:
                radius = 0;
                break;

            case SceneObjectType.Cone:
                radius = 0;
                break;

            default: // Default case is a sphere
                radius = 0;
                break;
        }

        return radius;
    }
}
