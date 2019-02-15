import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { SceneObjectType } from "../../../../common/communication/iSceneObject";
import { CollisionValidator } from "../../services/scene/utilitaries/collision-validator";

/* tslint:disable:no-any no-magic-numbers */
let collisionValidator: CollisionValidator;

describe("Scene builder tests", () => {

    beforeEach(() => {

        chai.use(spies);

        collisionValidator = new CollisionValidator();
    });

});
