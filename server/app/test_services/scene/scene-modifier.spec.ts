import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { ISceneObject} from "../../../../common/communication/iSceneObject";
import { ISceneOptions, SceneType } from "../../../../common/communication/iSceneOptions";
import { IModification, ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneBuilder } from "../../services/scene/scene-builder";
import { SceneModifier } from "../../services/scene/scene-modifier";

// tslint:disable:no-any prefer-for-of no-magic-numbers max-func-body-length

let sceneModifier:          SceneModifier;
let sceneBuilder:           SceneBuilder;
let iSceneVariables:        ISceneVariables;
let iSceneObjectGenerated:  ISceneObject[];
let iSceneOptions:          ISceneOptions;
let counterDifference:      number;
let modifiedList:           IModification[];

beforeEach(() => {
    chai.use(spies);
    iSceneObjectGenerated   = [];
    modifiedList            = [];
    sceneBuilder            = new SceneBuilder();
    sceneModifier           = new SceneModifier(sceneBuilder);

    for (let i: number = 0; i < 10; i++) {
        const tempObject: ISceneObject = {
            id:         i,
            type:       1,
            position:   { x: i * 10,    y: i * 10,      z: i * 10 },
            rotation:   { x: 0.1,       y: 0.1,         z: 0.1 },
            color:      "#FFFFFF",
            scale:      { x: 0.5,       y: 0.5,         z: 0.5},
            hidden:     false,
        };
        iSceneObjectGenerated.push(tempObject);
    }
    iSceneVariables = {
        theme:                  SceneType.Thematic,
        gameName:               "game",
        sceneObjectsQuantity:   10,
        sceneObjects:           iSceneObjectGenerated,
        sceneBackgroundColor:   "#FFFFFF",
    };

    counterDifference = 0;
});

describe("Scene-modifier tests", () => {

    it("should have called addObject()", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, false, false],
        };
        const spy: any = chai.spy.on(sceneModifier, "addObject");
        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        chai.expect(spy).to.have.been.called();
    });

    it("should have called removeObject", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, true, false],
        };

        const spy: any = chai.spy.on(sceneModifier, "removeObject");
        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        chai.expect(spy).to.have.been.called();
    });

    it("should have called changeObjectColor()", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, false, true],
        };

        const spy: any = chai.spy.on(sceneModifier, "changeObjectColor");
        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        chai.expect(spy).to.have.been.called();
    });

    it("should have 7 additions", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, false, false],
        };

        const resultScene: ISceneVariables = sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        resultScene.sceneObjects.forEach((object: ISceneObject) => {
            for (let i: number = 0; i < iSceneVariables.sceneObjects.length; i++) {

                const isEqualId:    boolean = object.id     === iSceneVariables.sceneObjects[i].id;
                const isEqualColor: boolean = object.color  !== iSceneVariables.sceneObjects[i].color;

                if (isEqualId && isEqualColor) {
                    counterDifference++;
                    break;
                }
                if (object.color === iSceneVariables.sceneObjects[i].color) {
                    continue;
                }
                counterDifference++;
                break;
            }
        });

        chai.expect(counterDifference).to.be.equal(17);
    });

    it("should have 7 removals", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, true, false],
        };

        const resultScene: ISceneVariables = sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        chai.expect(resultScene.sceneObjects.length).to.be.equal(10);
    });

    it("should have 7 color changes", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, false, true],
        };

        const resultScene: ISceneVariables = sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        resultScene.sceneObjects.forEach((object: ISceneObject) => {
            for (let i: number = 0; i < iSceneVariables.sceneObjects.length; i++) {

                const isEqualId:    boolean = object.id     === iSceneVariables.sceneObjects[i].id;
                const isEqualColor: boolean = object.color  !== iSceneVariables.sceneObjects[i].color;

                if (isEqualId && isEqualColor) {
                    counterDifference++;
                    break;
                }
                if (object.color === iSceneVariables.sceneObjects[i].color) {
                    continue;
                }
                counterDifference++;
                break;
            }
        });

        chai.expect(counterDifference).to.be.equal(7);
    });

    it("should have 7 modifications (additions and removals)", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, true, false],
        };

        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);
        chai.expect(modifiedList.length).to.be.equal(7);
    });

    it("should not call changeObjectColor)", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, true, false],
        };

        const spy: any = chai.spy.on(sceneModifier, "changeObjectColor");
        chai.expect(spy).to.not.have.been.called();
    });

    it("should have 7 modifications (removals and colors)", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, true, true],
        };

        const spy: any = chai.spy.on(sceneModifier, "addObject");
        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        chai.expect(spy).to.not.have.been.called();
        chai.expect(modifiedList.length).to.be.equal(7);
    });

    it("should have 7 modifications (additions and colors)", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, false, true],
        };

        const spy: any = chai.spy.on(sceneModifier, "removeObject");
        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        chai.expect(spy).to.not.have.been.called();
        chai.expect(modifiedList.length).to.be.equal(7);
    });

    it("should have 0 modification", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, false, false],
        };

        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        chai.expect(modifiedList.length).to.be.equal(0);
    });

    it("should have 7 modifications (additions, removals and colors)", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, true, true],
        };

        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        chai.expect(modifiedList.length).to.be.equal(7);
    });
});
