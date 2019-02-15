import { Injectable } from "@angular/core";
import { ICard } from "../../../../common/communication/iCard";
import { Constants } from "../constants";

@Injectable({
  providedIn: "root",
})
export class ActiveGameService {

  public activeGame: ICard;

  public get originalImage(): string {
    return this.activeGame.gameImageUrl;
  }

  public get modifiedImage(): string {
    return Constants.PATH_TO_IMAGES + "/" + this.activeGame.gameID + Constants.MODIFIED_FILE;
  }

}
