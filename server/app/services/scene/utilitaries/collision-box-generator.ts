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

            default: // Default case is a sphere
                radius = this.calculateSphereCollisionRadius(sceneObject);
                break;
        }

        return radius;
    }

    private calculateCubeCollisionRadius(sceneObject: ISceneObject): number {

        const a: number = this.getHalf(sceneObject.scale.x);
        const b: number = this.getHalf(sceneObject.scale.y);
        const c: number = this.getHalf(sceneObject.scale.z);

        return Math.sqrt( this.pythagore( [a, b, c] ) );
    }

    private calculatePyramidCollisionRadius(sceneObject: ISceneObject): number {

        // for now scale.x = radius and scale.y = heigth
        const a: number = sceneObject.scale.x;
        const b: number = this.getThird(sceneObject.scale.y);

        return Math.sqrt( this.pythagore( [a, b] ) );
    }

    private calculateConeCollisionRadius(sceneObject: ISceneObject): number {

        // for now scale.x = radius and scale.y = heigth
        const a: number = sceneObject.scale.x;
        const b: number = this.getThird(sceneObject.scale.y);

        return Math.sqrt( this.pythagore( [a, b] ) );
    }

    private calculateCylinderCollisionRadius(sceneObject: ISceneObject): number {

        const a: number = this.getHalf(sceneObject.scale.x);
        const b: number = this.getHalf(sceneObject.scale.y);

        return Math.sqrt( this.pythagore( [a, b] ) );
    }

    private calculateSphereCollisionRadius(sceneObject: ISceneObject): number {

        return sceneObject.scale.x;
    }

    private pythagore(values: number[]): number {

        let result: number = 0;

        values.forEach((element: number) => {
            result += Math.pow(element, SceneConstants.TWO);
        });

        return result;
    }

    private getHalf(value: number): number {

        return value / SceneConstants.TWO;
    }

    private getThird(value: number): number {

        return value / SceneConstants.THREE;
    }
}
