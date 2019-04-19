import { ISceneObject, SceneObjectType } from "../../../../../common/communication/iSceneObject";
import { SceneConstants } from "../sceneConstants";

export class CollisionBoxGenerator {

    public generateCollisionRadius(sceneObject: ISceneObject): number {
        let radius: number;

        switch (sceneObject.type) {
            case SceneObjectType.Cube:
                radius = this.calculateCubeCollisionRadius(sceneObject);
                break;
            case SceneObjectType.Sphere:
                radius = this.calculateSphereCollisionRadius(sceneObject);
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
            default:
                radius = this.calculateSphereCollisionRadius(sceneObject);
                break;
        }

        return radius;
    }

    public pythagore(values: number[]): number {

        let result: number = 0;

        values.forEach((element: number) => {
            result += Math.pow(element, SceneConstants.POWER_TWO);
        });

        return result;
    }

    private calculateCubeCollisionRadius(sceneObject: ISceneObject): number {
        return this.pythagore( [sceneObject.scale.x, sceneObject.scale.y, sceneObject.scale.z] );
    }

    private calculatePyramidCollisionRadius(sceneObject: ISceneObject): number {
        return this.pythagore( [sceneObject.scale.x, sceneObject.scale.y] );
    }

    private calculateConeCollisionRadius(sceneObject: ISceneObject): number {
        return this.pythagore( [sceneObject.scale.x, sceneObject.scale.y] );
    }

    private calculateCylinderCollisionRadius(sceneObject: ISceneObject): number {
        return this.pythagore( [sceneObject.scale.x, sceneObject.scale.y] );
    }

    private calculateSphereCollisionRadius(sceneObject: ISceneObject): number {
        return Math.pow(sceneObject.scale.x, SceneConstants.POWER_TWO);
    }
}
