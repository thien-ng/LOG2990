import { ISceneObject, SceneObjectType } from "../../../../../common/communication/iSceneObject";

export class CollisionBoxGenerator {

    public generateCollisionRadius(sceneObject: ISceneObject): number {

        let radius: number;

        switch (sceneObject.type) {
            case SceneObjectType.Cube:
                radius = this.calculateCubeCollisionRadius(sceneObject);
                break;

            case SceneObjectType.Cylinder:
                radius = this.calculateCylinderCollisionRadius(sceneObject);
                break;

            case SceneObjectType.TriangularPyramid:
                radius = this.calculatePyramidCollisionRadius(sceneObject);
                break;

            case SceneObjectType.Cone:
                radius = this.calculateConeCollisionRadius(sceneObject);
                break;

            default: // Default case is a sphere
                radius = this.calculateSphereCollisionRadius(sceneObject);
                break;
        }

        return radius;
    }

    public calculateCubeCollisionRadius(sceneObject: ISceneObject): number {
        const halfXsquared: number = Math.pow(sceneObject.scale.x / 2, 2);
        const halfYsquared: number = Math.pow(sceneObject.scale.y / 2, 2);
        const halfZsquared: number = Math.pow(sceneObject.scale.z / 2, 2);

        const radiusTempSquared: number = halfXsquared + halfZsquared;

        return Math.sqrt( halfYsquared + radiusTempSquared );
    }

    public calculatePyramidCollisionRadius(sceneObject: ISceneObject): number {

    }

    public calculateConeCollisionRadius(sceneObject: ISceneObject): number {

    }

    public calculateCylinderCollisionRadius(sceneObject: ISceneObject): number {

    }

    public calculateSphereCollisionRadius(sceneObject: ISceneObject): number {
        return sceneObject.scale.x;
    }

}
