import * as chai from "chai";
import "reflect-metadata";
import { ISceneObject } from "../../../../common/communication/iSceneObject";
import { CollisionValidator } from "../../services/scene/utilitaries/collision-validator";

/* tslint:disable:no-any no-magic-numbers */
let collisionValidator: CollisionValidator;

describe("Collision validator tests", () => {

    const cube1: ISceneObject = {
        id:     1,
        type:   1,
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

    const cube2: ISceneObject = {
        id:     2,
        type:   1,
        position: {
            x: 120, y: 120, z: 120,
        },
        rotation: {
            x: 1,   y: 1,   z: 1,
        },
        scale: {
            x: 10,  y: 10,  z: 10,
        },
        color: "#8cadbb",
    };

    const cube3: ISceneObject = {
        id:     3,
        type:   1,
        position: {
            x: 220, y: 220, z: 220,
        },
        rotation: {
            x: 1,   y: 1,   z: 1,
        },
        scale: {
            x: 10,  y: 10,  z: 10,
        },
        color: "#8cadbb",
    };

    const existingSceneObjects: ISceneObject[] = [cube1, cube2, cube3];

    beforeEach(() => {

        collisionValidator = new CollisionValidator();
    });

    it("should return false if there is no collision between new and already existing scene objects", () => {
        const newCube: ISceneObject = {
            id: 1,
            type: 1,
            position: {
                x: 500, y: 500, z: 500 },
            rotation: {
                x: 1, y: 1, z: 1,
            },
            scale: {
                x: 10, y: 10, z: 10,
            },
            color: "#8cadbb",
        };

        const isColliding: boolean = collisionValidator.hasCollidingPositions(newCube, existingSceneObjects);

        chai.expect(isColliding).equal(false);
    });

    it("should return true if there is collision between new and already existing scene objects", () => {
        const newCube: ISceneObject = {
            id: 1,
            type: 1,
            position: {
                x: 220, y: 220, z: 220 },
            rotation: {
                x: 1, y: 1, z: 1,
            },
            scale: {
                x: 10, y: 10, z: 10,
            },
            color: "#8cadbb",
        };

        const isColliding: boolean = collisionValidator.hasCollidingPositions(newCube, existingSceneObjects);

        chai.expect(isColliding).equal(true);
    });

});
