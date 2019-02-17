import { HttpClient } from "@angular/common/http";
import { AfterContentInit, Component } from "@angular/core";
import { Constants } from "src/app/constants";
import { ISceneVariables } from "../../../../../common/communication/iSceneVariables";

@Component({
  selector: "app-game-view-free",
  templateUrl: "./game-view-free.component.html",
  styleUrls: ["./game-view-free.component.css"],
})
export class GameViewFreeComponent implements AfterContentInit {

  public constructor(private httpClient: HttpClient) {

  }

  public readonly NEEDED_SNAPSHOT: boolean = false;
  public iSceneVariables: ISceneVariables;

  public ngAfterContentInit(): void {
    this.httpClient.post(Constants.GAME_REQUEST_PATH, "test").subscribe((data: any) => {
    });
  }

}
