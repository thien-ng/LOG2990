import { Component } from "@angular/core";
import { ISceneVariables } from "../../../../../common/communication/iSceneVariables";
import { SceneObjectType } from "../../../../../common/communication/iSceneObject";

@Component({
  selector: "app-game-view-free",
  templateUrl: "./game-view-free.component.html",
  styleUrls: ["./game-view-free.component.css"],
})
export class GameViewFreeComponent {

  public readonly NEEDED_SNAPSHOT = true;

  private iAxisValues = {
    x: 2,
    y: 3,
    z: 1,
  };
  
  private iSceneVariables: ISceneVariables = {
    sceneObjectsQuantity: 5,
    sceneObjects: [
      {type: SceneObjectType.TriangularPyramid,
        position: {
          x: 2,
          y: 3,
          z: 1,
        },
        rotation: this.iAxisValues,
        color: "#ff00ff",
        scale: this.iAxisValues},
      {type: SceneObjectType.Cube,
        position: {
          x: 30,
          y: 3,
          z: 1,
      },
        rotation: this.iAxisValues,
        color: "#0000ff",
        scale: this.iAxisValues},
      {type: SceneObjectType.Cone,
        position: {
          x: 300,
          y: 400,
          z: 200,
        },
        rotation: this.iAxisValues,
        color: "#00ff00",
        scale: this.iAxisValues},
      {type: SceneObjectType.Sphere,
        position: {
          x: 900,
          y: 231,
          z: 500,
        },
      rotation: this.iAxisValues,
      color: "#ff0000",
      scale: this.iAxisValues},
      {type: SceneObjectType.Cylinder,
        position: {
          x: 345,
          y: 764,
          z: 123,
        },
      rotation: this.iAxisValues,
      color: "#ea6117",
      scale: this.iAxisValues},
    ],
    sceneBackgroundColor: "#aaaaaa",
  };

}
