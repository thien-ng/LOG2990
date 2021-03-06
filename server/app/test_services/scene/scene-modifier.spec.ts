import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { ISceneObject} from "../../../../common/communication/iSceneObject";
import { ISceneOptions, SceneType } from "../../../../common/communication/iSceneOptions";
import { IModification, ISceneVariables, ModificationType } from "../../../../common/communication/iSceneVariables";
import { SceneBuilder } from "../../services/scene/scene-builder";
import { SceneModifier } from "../../services/scene/scene-modifier";

// tslint:disable:no-any prefer-for-of no-magic-numbers max-func-body-length no-any max-file-line-count

let sceneModifier:          SceneModifier;
let sceneBuilder:           SceneBuilder;
let iSceneVariables:        ISceneVariables<ISceneObject>;
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

describe("Scene-modifier tests (only 1 change)", () => {

    it("should have called addObject() when modifying the scene", () => {
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

    it("should have called removeObject() when modifying the scene", () => {
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

    it("should have called changeObjectColor() when modifying the scene", () => {
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

        const resultScene: ISceneVariables<ISceneObject> = sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

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

        const resultScene: ISceneVariables<ISceneObject> = sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        let differenceCounter: number = 0;

        resultScene.sceneObjects.forEach((object: any) => {
            if (object.hidden) {
                differenceCounter++;
            }
        });

        chai.expect(differenceCounter).to.be.equal(7);
    });

    it("should have 7 color changes", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, false, true],
        };

        const resultScene: ISceneVariables<ISceneObject> = sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

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

});

describe("Scene-modifier tests (2 changes) [true, true, false]", () => {

    beforeEach(() => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, true, false],
        };
    });

    it("should have 7 modifications (additions and removals)", () => {

        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);
        chai.expect(modifiedList.length).to.be.equal(7);
    });

    it("should not have call changeObjectColor", () => {

        const spy: any = chai.spy.on(sceneModifier, "changeObjectColor");
        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        chai.expect(spy).to.not.have.been.called();
    });

    it("should have additions and/or removals modifications", () => {

        const sceneModified: ISceneVariables<ISceneObject> = sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        modifiedList.forEach((modifiedListElt: any) => {
            sceneModified.sceneObjects.forEach((sceneObjElt: any) => {
                if (modifiedListElt.id === sceneObjElt.id && modifiedListElt.type === ModificationType.added) {
                    counterDifference++;
                }
            });
        });

        modifiedList.forEach((modifiedListElt: any) => {
            iSceneVariables.sceneObjects.forEach((sceneObjElt: any) => {
                if (modifiedListElt.id === sceneObjElt.id && modifiedListElt.type === ModificationType.removed) {
                    counterDifference++;
                }
            });
        });

        chai.expect(counterDifference).to.be.equal(7);
    });
});

describe("Scene-modifier tests (2 changes) [false, true, true]", () => {

    beforeEach(() => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, true, true],
        };
    });

    it("should have 7 modifications (removals and colors)", () => {

        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);
        chai.expect(modifiedList.length).to.be.equal(7);
    });

    it("should not have called addObject", () => {

        const spy: any = chai.spy.on(sceneModifier, "addObject");
        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        chai.expect(spy).to.not.have.been.called();
    });

    it("should have removals and/or color modifications", () => {

        const sceneModified: ISceneVariables<ISceneObject> = sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        modifiedList.forEach((modifiedListElt: any) => {
            iSceneVariables.sceneObjects.forEach((sceneObjElt: any) => {
                if (modifiedListElt.id === sceneObjElt.id && modifiedListElt.type === ModificationType.removed) {
                    counterDifference++;
                }
            });
        });

        sceneModified.sceneObjects.forEach((sceneModifiedElt: any) => {
            iSceneVariables.sceneObjects.forEach((sceneObjElt: any) => {
                if (sceneModifiedElt.id === sceneObjElt.id && sceneModifiedElt.color !== sceneObjElt.color) {
                    counterDifference++;
                }
            });
        });

        chai.expect(counterDifference).to.be.equal(7);
    });
});

describe("Scene-modifier tests (2 changes) [true, false, true]", () => {

    beforeEach(() => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, false, true],
        };
    });

    it("should have 7 modifications (additions and colors)", () => {

        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);
        chai.expect(modifiedList.length).to.be.equal(7);
    });

    it("should not have called removeObject", () => {

        const spy: any = chai.spy.on(sceneModifier, "removeObject");
        sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        chai.expect(spy).to.not.have.been.called();
    });

    it("should have additon and/or color modifications", () => {

        const sceneModified: ISceneVariables<ISceneObject> = sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        modifiedList.forEach((modifiedListElt: any) => {
            sceneModified.sceneObjects.forEach((sceneObjElt: any) => {
                if (modifiedListElt.id === sceneObjElt.id && modifiedListElt.type === ModificationType.added) {
                    counterDifference++;
                }
            });
        });

        sceneModified.sceneObjects.forEach((sceneModifiedElt: any) => {
            iSceneVariables.sceneObjects.forEach((sceneObjElt: any) => {
                if (sceneModifiedElt.id === sceneObjElt.id && sceneModifiedElt.color !== sceneObjElt.color) {
                    counterDifference++;
                }
            });
        });

        chai.expect(counterDifference).to.be.equal(7);
    });
});

describe("Scene-modifier tests (3 changes or no change)", () => {

    beforeEach(() => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, false, false],
        };
    });

    it("should have 0 modification", () => {

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

    it("should have additon, remove, or change object color", () => {
        iSceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, false, true],
        };

        const sceneModified: ISceneVariables<ISceneObject> = sceneModifier.modifyScene(iSceneOptions, iSceneVariables, modifiedList);

        modifiedList.forEach((modifiedListElt: any) => {
            sceneModified.sceneObjects.forEach((sceneObjElt: any) => {
                if (modifiedListElt.id === sceneObjElt.id && modifiedListElt.type === ModificationType.added) {
                    counterDifference++;
                }
            });
        });

        modifiedList.forEach((modifiedListElt: any) => {
            iSceneVariables.sceneObjects.forEach((sceneObjElt: any) => {
                if (modifiedListElt.id === sceneObjElt.id && modifiedListElt.type === ModificationType.removed) {
                    counterDifference++;
                }
            });
        });

        sceneModified.sceneObjects.forEach((sceneModifiedElt: any) => {
            iSceneVariables.sceneObjects.forEach((sceneObjElt: any) => {
                if (sceneModifiedElt.id === sceneObjElt.id && sceneModifiedElt.color !== sceneObjElt.color) {
                    counterDifference++;
                }
            });
        });

        chai.expect(counterDifference).to.be.equal(7);
    });
});
