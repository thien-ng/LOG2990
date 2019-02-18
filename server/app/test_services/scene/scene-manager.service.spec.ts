import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { FormMessage } from "../../../../common/communication/message";
import { SceneManager } from "../../services/scene/scene-manager.service";

/* tslint:disable:no-any no-magic-numbers */

let sceneManager: SceneManager;
let formMessage: FormMessage;

beforeEach(() => {
    chai.use(spies);
    sceneManager = new SceneManager();
});

describe("SceneManager Tests", () => {

    it("should return scene variables with Geometric theme", () => {
        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            selectedOption: "Geometric",
            quantityChange: 10,
        };

        const spy: any = chai.spy.on(sceneManager, "objectTypeIdentifier");

        sceneManager.createScene(formMessage);

        chai.expect(spy).to.have.been.called.with("Geometric");
    });

    it("should return scene variables with Thematic theme", () => {
        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            selectedOption: "Thematic",
            quantityChange: 10,
        };

        const spy: any = chai.spy.on(sceneManager, "objectTypeIdentifier");

        sceneManager.createScene(formMessage);

        chai.expect(spy).to.have.been.called.with("Thematic");
    });

    // it("should generate new interface for cube of ISceneVariables", () => {

    //     formMessage = {
    //         gameName: "gameName",
    //         checkedTypes: [true, true, true],
    //         selectedOption: "cube",
    //         quantityChange: 1,
    //     };

    //     const result: ISceneVariables = sceneManager.createScene(formMessage);
    //     expect(result.sceneObjects[0].type).to.be.equal(SceneObjectType.Cube);
    // });

    // it("should generate new interface for sphere of ISceneVariables", () => {

    //     formMessage = {
    //         gameName: "gameName",
    //         checkedTypes: [true, true, true],
    //         selectedOption: "sphere",
    //         quantityChange: 1,
    //     };

    //     const result: ISceneVariables = sceneManager.createScene(formMessage);
    //     expect(result.sceneObjects[0].type).to.be.equal(SceneObjectType.Sphere);
    // });

    // it("should generate new interface for cylinder of ISceneVariables", () => {

    //     formMessage = {
    //         gameName: "gameName",
    //         checkedTypes: [true, true, true],
    //         selectedOption: "cylinder",
    //         quantityChange: 3,
    //     };

    //     const result: ISceneVariables = sceneManager.createScene(formMessage);
    //     expect(result.sceneObjects[0].type).to.be.equal(SceneObjectType.Cylinder);
    // });

    // it("should generate new interface for cone of ISceneVariables", () => {

    //     formMessage = {
    //         gameName: "gameName",
    //         checkedTypes: [true, true, true],
    //         selectedOption: "cone",
    //         quantityChange: 4,
    //     };

    //     const result: ISceneVariables = sceneManager.createScene(formMessage);
    //     expect(result.sceneObjects[0].type).to.be.equal(SceneObjectType.Cone);
    // });

    // it("should generate new interface for pyramid of ISceneVariables", () => {

    //     formMessage = {
    //         gameName: "gameName",
    //         checkedTypes: [true, true, true],
    //         selectedOption: "pyramid",
    //         quantityChange: 5,
    //     };

    //     const result: ISceneVariables = sceneManager.createScene(formMessage);
    //     expect(result.sceneObjects[0].type).to.be.equal(SceneObjectType.TriangularPyramid);
    // });

});
