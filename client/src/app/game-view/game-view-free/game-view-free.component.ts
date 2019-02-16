import { Component } from "@angular/core";
import { ISceneVariables } from "../../../../../common/communication/iSceneVariables";

@Component({
  selector: "app-game-view-free",
  templateUrl: "./game-view-free.component.html",
  styleUrls: ["./game-view-free.component.css"],
})
export class GameViewFreeComponent {

  public readonly NEEDED_SNAPSHOT: boolean = false;
  public iSceneVariables: ISceneVariables;

}
