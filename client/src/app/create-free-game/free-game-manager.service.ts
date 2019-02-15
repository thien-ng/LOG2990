import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { FormMessage, Message } from "../../../../common/communication/message";
import { Constants } from "../constants";

const  SUBMIT_PATH: string = "/api/scene/generator";

@Injectable({
  providedIn: 'root'
})
export class FreeGameManagerService {

  constructor(private httpClient: HttpClient) {}

  public submitFormData(formMessage: FormMessage): void {
    this.httpClient.post(Constants.BASIC_SERVICE_BASE_URL + SUBMIT_PATH, formMessage).subscribe((response: Message) => {
      
    });
  }

}
