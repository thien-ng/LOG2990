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
        color:  "#8cadbb",
        hidden: false,
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
        color:  "#8cadbb",
        hidden: false,
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
        color:  "#8cadbb",
        hidden: false,
    };

    const sphere1: ISceneObject = {
        id:     4,
        type:   0,
        position: {
            x: 30, y: 30, z: 30,
        },
        rotation: {
            x: 1,   y: 1,   z: 1,
        },
        scale: {
            x: 10,  y: 10,  z: 10,
        },
        color:  "#8cadbb",
        hidden: false,
    };

    const sphere2: ISceneObject = {
        id:     5,
        type:   0,
        position: {
            x: 100, y: 100, z: 100,
        },
        rotation: {
            x: 1,   y: 1,   z: 1,
        },
        scale: {
            x: 10,  y: 10,  z: 10,
        },
        color:  "#8cadbb",
        hidden: false,
    };

    const cone1: ISceneObject = {
        id:     6,
        type:   2,
        position: {
            x: 130, y: 130, z: 130,
        },
        rotation: {
            x: 1,   y: 1,   z: 1,
        },
        scale: {
            x: 10,  y: 10,  z: 10,
        },
        color:  "#8cadbb",
        hidden: false,
    };

    const cone2: ISceneObject = {
        id:     7,
        type:   2,
        position: {
            x: 200, y: 200, z: 200,
        },
        rotation: {
            x: 1,   y: 1,   z: 1,
        },
        scale: {
            x: 10,  y: 10,  z: 10,
        },
        color:  "#8cadbb",
        hidden: false,
    };

    const cylinder1: ISceneObject = {
        id:     8,
        type:   3,
        position: {
            x: 230, y: 230, z: 230,
        },
        rotation: {
            x: 1,   y: 1,   z: 1,
        },
        scale: {
            x: 10,  y: 10,  z: 10,
        },
        color:  "#8cadbb",
        hidden: false,
    };

    const cylinder2: ISceneObject = {
        id:     9,
        type:   3,
        position: {
            x: 300, y: 300, z: 300,
        },
        rotation: {
            x: 1,   y: 1,   z: 1,
        },
        scale: {
            x: 10,  y: 10,  z: 10,
        },
        color:  "#8cadbb",
        hidden: false,
    };

    const triangularPyramid1: ISceneObject = {
        id:     10,
        type:   4,
        position: {
            x: 330, y: 330, z: 330,
        },
        rotation: {
            x: 1,   y: 1,   z: 1,
        },
        scale: {
            x: 10,  y: 10,  z: 10,
        },
        color:  "#8cadbb",
        hidden: false,
    };

    const triangularPyramid2: ISceneObject = {
        id:     11,
        type:   4,
        position: {
            x: 400, y: 400, z: 400,
        },
        rotation: {
            x: 1,   y: 1,   z: 1,
        },
        scale: {
            x: 10,  y: 10,  z: 10,
        },
        color:  "#8cadbb",
        hidden: false,
    };

    beforeEach(() => {
        collisionValidator = new CollisionValidator();
    });

    describe("tests collision with cubes", () => {
        const existingSceneObjects: ISceneObject[] = [cube1, cube2, cube3];

        it("should return false if there is no collision between new and already existing scene objects", () => {
            const newCube: ISceneObject = {
                id:     1,
                type:   1,
                position: {
                    x: 500, y: 500, z: 500,
                },
                rotation: {
                    x: 1,   y: 1,   z: 1,
                },
                scale: {
                    x: 10,  y: 10,  z: 10,
                },
                color:  "#8cadbb",
                hidden: false,
            };

            const isColliding: boolean = collisionValidator.hasCollidingPositions(newCube, existingSceneObjects);

            chai.expect(isColliding).equal(false);
        });

        it("should return true if there is collision between new and already existing scene objects", () => {
            const newCube: ISceneObject = {
                id:     1,
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
                color:  "#8cadbb",
                hidden: false,
            };

            const isColliding: boolean = collisionValidator.hasCollidingPositions(newCube, existingSceneObjects);

            chai.expect(isColliding).equal(true);
        });
    });

});
