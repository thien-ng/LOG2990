import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { ISceneObject} from "../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneModifier } from "../../services/scene/scene-modifier";
import { SceneBuilder } from "../../services/scene/scene-builder";
import { ISceneOptions, SceneType } from "../../../../common/communication/iSceneOptions";

// tslint:disable:no-any

let sceneModifier: SceneModifier;
let sceneBuilder: SceneBuilder;
let iSceneVariables: ISceneVariables;
let iSceneObjectGenerated: ISceneObject[];
let iSceneOptions: ISceneOptions;

beforeEach(() => {
    chai.use(spies);
    iSceneObjectGenerated = [];
    sceneBuilder = new SceneBuilder();
    sceneModifier = new SceneModifier(sceneBuilder);

    for (let i = 0; i < 10; i++) {
        const tempObject: ISceneObject = {
            id: i,
            type: 1,
            position: {x: i * 10, y: i * 10, z: i * 10},
            rotation: {x: 0.1, y: 0.1, z: 0.1},
            color: "#FFFFFF",
            scale: {x: 0.5, y: 0.5, z: 0.5},
        };
        iSceneObjectGenerated.push(tempObject);
    }
    iSceneVariables = {
        theme: SceneType.Thematic,
        gameName: "game",
        sceneObjectsQuantity: 10,
        sceneObjects: iSceneObjectGenerated,
        sceneBackgroundColor: "#FFFFFF",
    }
});

describe("Scene-modifier tests", () => {

    it("should add 7 objects to sceneObject array", () => {
        iSceneOptions = {
            sceneName: "game",
            sceneType: SceneType.Thematic,
            sceneObjectsQuantity: 10,
            selectedOptions: [true, false, false],
        };
        const spy: any = chai.spy.on(sceneModifier, "addObject");
        sceneModifier.modifyScene(iSceneOptions, iSceneVariables);
        chai.expect(spy).to.have.been.called();
    });

    it("should remove 7 objects to sceneObject array", () => {
        iSceneOptions = {
            sceneName: "game",
            sceneType: SceneType.Thematic,
            sceneObjectsQuantity: 10,
            selectedOptions: [false, true, false],
        };

        const spy: any = chai.spy.on(sceneModifier, "removeObject");
        sceneModifier.modifyScene(iSceneOptions, iSceneVariables);
        chai.expect(spy).to.have.been.called();
    });

    it("should change color 7 objects to sceneObject array", () => {
        iSceneOptions = {
            sceneName: "game",
            sceneType: SceneType.Thematic,
            sceneObjectsQuantity: 10,
            selectedOptions: [false, false, true],
        };

        const spy: any = chai.spy.on(sceneModifier, "changeObjectColor");
        sceneModifier.modifyScene(iSceneOptions, iSceneVariables);
        chai.expect(spy).to.have.been.called();
    });

});
