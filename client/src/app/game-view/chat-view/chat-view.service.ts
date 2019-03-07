import { Injectable } from "@angular/core";
import { IChat } from "../../../../../common/communication/iChat";
import { IPlayerInputResponse } from "../../../../../common/communication/iGameplay";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { Constants } from "../../constants";

@Injectable({
  providedIn: "root",
})
export class ChatViewService {

  private conversation: IChat[];

  public constructor() {
    this.conversation = [];
  }

  public updateConversation(data: IPlayerInputResponse): void {
    const status:   string = (data.status === CCommon.ON_SUCCESS) ? Constants.GOOD_CLICK_MESSAGE : Constants.FAILED_CLICK_MESSAGE;
    const body:     string =  status;

    const message:  IChat  = {
      username:   "SERVEUR",
      message:    body,
      time:       "time",
    };
    this.conversation.unshift(message);
  }

  public getConversation(): IChat[] {
    return this.conversation;
  }

  public clearConversations(): void {
    this.conversation = [];
  }
}
