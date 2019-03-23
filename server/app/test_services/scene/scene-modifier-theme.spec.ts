import * as chai from "chai";
import * as spies from "chai-spies";
import { ISceneEntity, ITheme } from "../../../../common/communication/ITheme";
import { IMesh } from "../../../../common/communication/iSceneObject";
import { ISceneOptions, SceneType } from "../../../../common/communication/iSceneOptions";
import { IMeshInfo, IModification, ISceneVariables, ModificationType } from "../../../../common/communication/iSceneVariables";
import { SceneBuilderTheme } from "../../services/scene/scene-builder-theme";
import { SceneModifierTheme } from "../../services/scene/scene-modifier-theme";

// tslint:disable:no-any no-magic-numbers no-any only-arrow-functions max-file-line-count max-line-length max-func-body-length

const meshInfo1: IMeshInfo = {
    GLTFUrl:    "url1",
    uuid:       "uuid1",
};

const meshInfo2: IMeshInfo = {
    GLTFUrl:    "url2",
    uuid:       "uuid2",
};

const entity1: ISceneEntity = {
    name:               "name",
    meshInfos:          [meshInfo1, meshInfo2],
    baseSize:           1,
    radius:             1,
    presenceRatio:      1,
};

const entity2: ISceneEntity = {
    name:               "patate",
    meshInfos:          [meshInfo1, meshInfo2],
    baseSize:           1,
    radius:             1,
    presenceRatio:      1,
};

const entities: ISceneEntity[] = [entity1, entity2];

const theme: ITheme = {
    name:                   "name",
    sceneEntities:          entities,
    floorEntity:            entity1,
    backgroundColor:        "#FFFFFF",
    startCameraPosition:    {x: 1, y: 1, z: 1},
    generationArea:         {
        minPosition: {x: -5000, y: -5000, z: -5000},
        maxPosition: {x: 5000, y: 5000, z: 5000},
    },
};

let sceneBuilder:   SceneBuilderTheme;
let sceneModifier:  SceneModifierTheme;
let sceneOptions:   ISceneOptions;
let sceneVariables: ISceneVariables<IMesh>;
let sceneObjects:   IMesh[];
let modifiedList:   IModification[];

beforeEach(() => {
    chai.use(spies);
    sceneObjects = [];
    modifiedList = [];
    sceneBuilder = new SceneBuilderTheme();
    sceneModifier = new SceneModifierTheme(sceneBuilder);
    for (let i: number = 0; i < 10; i++) {
        const tempObject: IMesh = {
            id:             i,
            meshInfo:       meshInfo1,
            name:           "name",
            radius:         1,
            position:       { x: i * 10,    y: i * 10,      z: i * 10 },
            rotation:       { x: 0.1,       y: 0.1,         z: 0.1 },
            scaleFactor:    0.75,
            hidden:     false,
        };
        sceneObjects.push(tempObject);

        sceneVariables =  {
            theme:                  SceneType.Thematic,
            gameName:               "game",
            sceneObjectsQuantity:   10,
            sceneObjects:           sceneObjects,
            sceneBackgroundColor:   "#FFFFFF",
        };

        sceneModifier["sceneBuilderTheme"]["theme"] = theme;
    }
});

describe("Scene-modifier-theme tests", () => {

    it("should do nothing when selected option is wrong", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, false, false],
        };
        const spy: any = chai.spy.on(sceneModifier, "addObject");
        sceneModifier["chooseOperation"]("wrongOptionnnnnnn<3");

        chai.expect(spy).not.to.have.been.called();
    });

    it("should have called addObject() when modifying the scene", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, false, false],
        };
        const spy: any = chai.spy.on(sceneModifier, "addObject");
        sceneModifier.modifyScene(sceneOptions, sceneVariables, modifiedList, entities);

        chai.expect(spy).to.have.been.called();
    });

    it("should have called removeObject() when modifying the scene", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, true, false],
        };
        const spy: any = chai.spy.on(sceneModifier, "removeObject");
        sceneModifier.modifyScene(sceneOptions, sceneVariables, modifiedList, entities);

        chai.expect(spy).to.have.been.called();
    });

    it("should have called changeObjectColor() when modifying the scene", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, false, true],
        };
        const spy: any = chai.spy.on(sceneModifier, "changeObjectColor");
        sceneModifier.modifyScene(sceneOptions, sceneVariables, modifiedList, entities);

        chai.expect(spy).to.have.been.called();
    });

    it("should have 7 additions", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, false, false],
        };

        const modifiedScene: ISceneVariables<IMesh> = sceneModifier.modifyScene(sceneOptions, sceneVariables, modifiedList, entities);
        let counter: number = 0;

        modifiedList.forEach((modifiedElement: IModification) => {
            modifiedScene.sceneObjects.forEach((mesh: IMesh) => {
                if (modifiedElement.id === mesh.id && modifiedElement.type === ModificationType.added) {
                    counter++;
                }
            });
        });

        chai.expect(counter).to.equal(7);
    });

    it("should have 7 removals", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, true, false],
        };

        sceneModifier.modifyScene(sceneOptions, sceneVariables, modifiedList, entities);
        let counter: number = 0;
        modifiedList.forEach((modifiedElement: IModification) => {
            sceneVariables.sceneObjects.forEach((mesh: IMesh) => {
                if (modifiedElement.id === mesh.id && modifiedElement.type === ModificationType.removed) {
                    counter++;
                }
            });
        });

        chai.expect(counter).to.equal(7);
    });

    it("should have 7 color changes", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, false, true],
        };

        const modifiedScene: ISceneVariables<IMesh> = sceneModifier.modifyScene(sceneOptions, sceneVariables, modifiedList, entities);
        let counter: number = 0;
        modifiedList.forEach((modifiedElement: IModification) => {
            modifiedScene.sceneObjects.forEach((mesh: IMesh) => {
                if (modifiedElement.id === mesh.id && mesh.meshInfo === entities[0].meshInfos[1]) {
                    counter++;
                }
            });
        });

        chai.expect(counter).to.equal(7);
    });

    it("should have 7 modifications (additions and/or removals)", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, true, false],
        };

        sceneModifier.modifyScene(sceneOptions, sceneVariables, modifiedList, entities);
        chai.expect(modifiedList.length).to.be.equal(7);
    });

    it("should have 7 modifications (additions and/or change)", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, false, true],
        };

        sceneModifier.modifyScene(sceneOptions, sceneVariables, modifiedList, entities);
        chai.expect(modifiedList.length).to.be.equal(7);
    });

    it("should have 7 modifications (remove and/or change)", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, true, true],
        };

        sceneModifier.modifyScene(sceneOptions, sceneVariables, modifiedList, entities);
        chai.expect(modifiedList.length).to.be.equal(7);
    });

    it("should have 7 modifications of additions and/or removals", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, true, false],
        };

        const sceneModified: ISceneVariables<IMesh> = sceneModifier.modifyScene(sceneOptions, sceneVariables, modifiedList, entities);
        let counter: number = 0;

        modifiedList.forEach((modifiedElement: IModification) => {
            sceneModified.sceneObjects.forEach((mesh: IMesh) => {

                if (modifiedElement.id === mesh.id && modifiedElement.type === ModificationType.added) {
                    counter++;
                }
            });
        });

        modifiedList.forEach((modifiedElement: IModification) => {
            sceneVariables.sceneObjects.forEach((mesh: IMesh) => {
                if (modifiedElement.id === mesh.id && modifiedElement.type === ModificationType.removed) {
                    counter++;
                }
            });
        });

        chai.expect(counter).to.equal(7);
    });

    it("should have 7 modifications of additions and/or changes", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, false, true],
        };

        const sceneModified: ISceneVariables<IMesh> = sceneModifier.modifyScene(sceneOptions, sceneVariables, modifiedList, entities);
        let counter: number = 0;

        modifiedList.forEach((modifiedElement: IModification) => {
            sceneModified.sceneObjects.forEach((mesh: IMesh) => {
                if (modifiedElement.id === mesh.id && modifiedElement.type === ModificationType.added) {
                    counter++;
                }
            });
        });

        modifiedList.forEach((modifiedElement: IModification) => {
            sceneModified.sceneObjects.forEach((mesh: IMesh) => {
                if (modifiedElement.id === mesh.id && mesh.meshInfo === entities[0].meshInfos[1] && modifiedElement.type !== ModificationType.added) {
                    counter++;
                }
            });
        });

        chai.expect(counter).to.equal(7);
    });

    it("should have 7 modifications of removes and/or changes", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [false, true, true],
        };

        const sceneModified: ISceneVariables<IMesh> = sceneModifier.modifyScene(sceneOptions, sceneVariables, modifiedList, entities);
        let counter: number = 0;

        modifiedList.forEach((modifiedElement: IModification) => {
            sceneVariables.sceneObjects.forEach((mesh: IMesh) => {
                if (modifiedElement.id === mesh.id && modifiedElement.type === ModificationType.removed) {
                    counter++;
                }
            });
        });

        modifiedList.forEach((modifiedElement: IModification) => {
            sceneModified.sceneObjects.forEach((mesh: IMesh) => {
                if (modifiedElement.id === mesh.id && mesh.meshInfo === entities[0].meshInfos[1] && modifiedElement.type !== ModificationType.removed) {
                    counter++;
                }
            });
        });

        chai.expect(counter).to.equal(7);
    });

    it("should have 7 modifications of add, removes and/or changes", () => {
        sceneOptions = {
            sceneName:              "game",
            sceneType:              SceneType.Thematic,
            sceneObjectsQuantity:   10,
            selectedOptions:        [true, true, true],
        };

        const sceneModified: ISceneVariables<IMesh> = sceneModifier.modifyScene(sceneOptions, sceneVariables, modifiedList, entities);
        let counter: number = 0;

        modifiedList.forEach((modifiedElement: IModification) => {
            sceneModified.sceneObjects.forEach((mesh: IMesh) => {
                if (modifiedElement.id === mesh.id && modifiedElement.type === ModificationType.added) {
                    counter++;
                }
            });
        });

        modifiedList.forEach((modifiedElement: IModification) => {
            sceneVariables.sceneObjects.forEach((mesh: IMesh) => {
                if (modifiedElement.id === mesh.id && modifiedElement.type === ModificationType.removed) {
                    counter++;
                }
            });
        });

        modifiedList.forEach((modifiedElement: IModification) => {
            sceneModified.sceneObjects.forEach((mesh: IMesh) => {
                if (modifiedElement.id === mesh.id &&
                    mesh.meshInfo === entities[0].meshInfos[1] &&
                    modifiedElement.type !== ModificationType.removed &&
                    modifiedElement.type !== ModificationType.added) {
                    counter++;
                }
            });
        });

        chai.expect(counter).to.equal(7);
    });

});
