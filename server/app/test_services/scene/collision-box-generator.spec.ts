import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { ISceneObject, SceneObjectType } from "../../../../common/communication/iSceneObject";
import { CollisionBoxGenerator } from "../../services/scene/utilitaries/collision-box-generator";

/* tslint:disable:no-any no-magic-numbers */
let collisionBoxGenerator: CollisionBoxGenerator;

describe("Scene builder tests", () => {

    const cube: ISceneObject = {
        type: SceneObjectType.Cube,
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

    const cylinder: ISceneObject = {
        type: SceneObjectType.Cylinder,
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

    const pyramid: ISceneObject = {
        type: SceneObjectType.TriangularPyramid,
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

    const cone: ISceneObject = {
        type: SceneObjectType.Cone,
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

    const sphere: ISceneObject = {
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

    beforeEach(() => {

        chai.use(spies);

        collisionBoxGenerator = new CollisionBoxGenerator();
    });

});
