import { ISceneObject, SceneObjectType } from "../../../../../common/communication/iSceneObject";
import { SceneConstants } from "../sceneConstants";

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

    private calculateCubeCollisionRadius(sceneObject: ISceneObject): number {

        return this.pythagore3D( sceneObject.scale.x / SceneConstants.TWO, sceneObject.scale.y / SceneConstants.TWO, sceneObject.scale.z / SceneConstants.TWO );
    }

    private calculatePyramidCollisionRadius(sceneObject: ISceneObject): number {

        // for now scale.x = radius and scale.y = heigth
        return this.pythagore( sceneObject.scale.x, sceneObject.scale.y / SceneConstants.THREE );
    }

    private calculateConeCollisionRadius(sceneObject: ISceneObject): number {

        // for now scale.x = radius and scale.y = heigth
        return this.pythagore( sceneObject.scale.x, sceneObject.scale.y / SceneConstants.THREE );
    }

    private calculateCylinderCollisionRadius(sceneObject: ISceneObject): number {

        return this.pythagore( sceneObject.scale.x / SceneConstants.TWO, sceneObject.scale.y / SceneConstants.TWO );
    }

    private calculateSphereCollisionRadius(sceneObject: ISceneObject): number {

        return sceneObject.scale.x;
    }

    private pythagore(x: number, y: number): number {

        const xSquared: number = Math.pow(x, SceneConstants.TWO);
        const ySquared: number = Math.pow(y, SceneConstants.TWO);

        return Math.sqrt( xSquared + ySquared );
    }

    private pythagore3D(x: number, y: number, z: number): number {

        const xSquared: number = Math.pow(x, SceneConstants.TWO);
        const ySquared: number = Math.pow(y, SceneConstants.TWO);
        const zSquared: number = Math.pow(z, SceneConstants.TWO);

        return Math.sqrt( xSquared + ySquared + zSquared );
    }

}
