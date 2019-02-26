import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { ISceneObject, SceneObjectType } from "../../../../common/communication/iSceneObject";
import { CollisionBoxGenerator } from "../../services/scene/utilitaries/collision-box-generator";

/* tslint:disable:no-any no-magic-numbers */
let collisionBoxGenerator: CollisionBoxGenerator;

describe("Collision box generator tests", () => {

    const cube: ISceneObject = {
        id:     1,
        type:   SceneObjectType.Cube,
        position: {
            x: 20, y: 20, z: 20,
        },
        rotation: {
            x: 1,  y: 1,  z: 1,
        },
        scale: {
            x: 10, y: 10, z: 10,
        },
        color: "#8cadbb",
    };

    const cylinder: ISceneObject = {
        id:     2,
        type:   SceneObjectType.Cylinder,
        position: {
            x: 20, y: 20, z: 20,
        },
        rotation: {
            x: 1,  y: 1,  z: 1,
        },
        scale: {
            x: 10, y: 10, z: 10,
        },
        color: "#8cadbb",
    };

    const pyramid: ISceneObject = {
        id:     3,
        type:   SceneObjectType.TriangularPyramid,
        position: {
            x: 20, y: 20, z: 20,
        },
        rotation: {
            x: 1,  y: 1,  z: 1,
        },
        scale: {
            x: 10, y: 10, z: 10,
        },
        color: "#8cadbb",
    };

    const cone: ISceneObject = {
        id:     4,
        type:   SceneObjectType.Cone,
        position: {
            x: 20, y: 20, z: 20,
        },
        rotation: {
            x: 1,  y: 1,  z: 1,
        },
        scale: {
            x: 10, y: 10, z: 10,
        },
        color: "#8cadbb",
    };

    const sphere: ISceneObject = {
        id: 5,
        type: SceneObjectType.Sphere,
        position: {
            x: 20, y: 20, z: 20 },
        rotation: {
            x: 1, y: 1, z: 1,
        },
        scale: {
            x: 10, y: 10, z: 10,
        },
        color: "#8cadbb",
    };

    const defaultObject: ISceneObject = {
        id: 1,
        type: 10,
        position: {
            x: 20, y: 20, z: 20 },
        rotation: {
            x: 1, y: 1, z: 1,
        },
        scale: {
            x: 10, y: 10, z: 10,
        },
        color: "#8cadbb",
    };

    beforeEach(() => {

        chai.use(spies);

        collisionBoxGenerator = new CollisionBoxGenerator();
    });

    it("should call calculateCubeCollisionRadius for cube object", () => {
        const spy: any = chai.spy.on(collisionBoxGenerator, "calculateCubeCollisionRadius");

        collisionBoxGenerator.generateCollisionRadius(cube);

        chai.expect(spy).to.have.been.called();
    });

    it("should call calculateCylinderCollisionRadius for cylinder object", () => {
        const spy: any = chai.spy.on(collisionBoxGenerator, "calculateCylinderCollisionRadius");

        collisionBoxGenerator.generateCollisionRadius(cylinder);

        chai.expect(spy).to.have.been.called();
    });

    it("should call calculatePyramidCollisionRadius for triangular pyramid object", () => {
        const spy: any = chai.spy.on(collisionBoxGenerator, "calculatePyramidCollisionRadius");

        collisionBoxGenerator.generateCollisionRadius(pyramid);

        chai.expect(spy).to.have.been.called();
    });

    it("should call calculateConeCollisionRadius for cone object", () => {
        const spy: any = chai.spy.on(collisionBoxGenerator, "calculateConeCollisionRadius");

        collisionBoxGenerator.generateCollisionRadius(cone);

        chai.expect(spy).to.have.been.called();
    });

    it("should call calculateSphereCollisionRadius for sphere object", () => {
        const spy: any = chai.spy.on(collisionBoxGenerator, "calculateSphereCollisionRadius");

        collisionBoxGenerator.generateCollisionRadius(sphere);

        chai.expect(spy).to.have.been.called();
    });

    it("should call calculateSphereCollisionRadius for an undefined object type", () => {
        const spy: any = chai.spy.on(collisionBoxGenerator, "calculateSphereCollisionRadius");

        collisionBoxGenerator.generateCollisionRadius(defaultObject);

        chai.expect(spy).to.have.been.called();
    });
});
