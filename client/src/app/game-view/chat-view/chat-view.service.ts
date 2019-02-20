import { Injectable } from "@angular/core";
import { IChat } from "../../../../../common/communication/iChat";
import { IPlayerInputResponse } from "../../../../../common/communication/iGameplay";
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
    const body: string = (data.status === Constants.ON_FAILED_CLICK) ? "Wrong Hit" : "Good Hit";
    const message: IChat = {
      username: "SERVEUR",
      message:  body,
      time: "time",
    }
    this.conversation.unshift(message);
  }

  public getConversation(): IChat[] {
    return this.conversation;
  }

  public clearConversations(): void {
    this.conversation = [];
  }

}
