import { expect } from "chai";
import "reflect-metadata";
import { ISceneObject } from "../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneModifier } from "../../services/scene/scene-modifier";
import { SceneBuilder } from "../../services/scene/scene-builder";

let sceneModifier: SceneModifier;
let sceneBuilder: SceneBuilder;
let iSceneVariables: ISceneVariables;

beforeEach(() => {
    sceneBuilder = new SceneBuilder();
    sceneModifier = new SceneModifier(sceneBuilder);
});

describe("Scene-modifier tests", () => {

    it("should ", () => {

    });

});
