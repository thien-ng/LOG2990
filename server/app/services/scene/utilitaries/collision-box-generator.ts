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

        return this.pythagore3D(sceneObject.scale.x / 2, sceneObject.scale.y / 2, sceneObject.scale.z / 2);
    }

    public calculatePyramidCollisionRadius(sceneObject: ISceneObject): number {

    }

    public calculateConeCollisionRadius(sceneObject: ISceneObject): number {

    }

    public calculateCylinderCollisionRadius(sceneObject: ISceneObject): number {

        return this.pythagore3D(sceneObject.scale.x / 2, sceneObject.scale.y / 2, sceneObject.scale.z / 2);
    }

    public calculateSphereCollisionRadius(sceneObject: ISceneObject): number {
        return sceneObject.scale.x;
    }

    private pythagore(x: number, y: number): number {

    }

    private pythagore3D(x: number, y: number, z: number): number {
        const halfXsquared: number = Math.pow(x, 2);
        const halfYsquared: number = Math.pow(y, 2);
        const halfZsquared: number = Math.pow(z, 2);

        return Math.sqrt( halfXsquared + halfYsquared + halfZsquared );
    }

}
