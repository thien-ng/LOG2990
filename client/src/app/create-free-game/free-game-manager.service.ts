import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { FormMessage } from "../../../../common/communication/message";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { Constants } from "../constants";
import { ThreejsViewService } from "../game-view/game-view-free/threejs-view/threejs-view.service";

const  SUBMIT_PATH: string = "/api/scene/generator";

@Injectable({
  providedIn: 'root'
})
export class FreeGameManagerService {

  constructor(
    private httpClient: HttpClient,
    private threejsViewService: ThreejsViewService) {}

  public submitFormData(formMessage: FormMessage): void {
    this.httpClient.post(Constants.BASIC_SERVICE_BASE_URL + SUBMIT_PATH, formMessage).subscribe((response: ISceneVariables) => {
      this.threejsViewService.updateSceneVariable(response);
    });
  }

}
