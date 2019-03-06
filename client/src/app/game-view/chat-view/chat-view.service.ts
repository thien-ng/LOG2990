import { Injectable } from "@angular/core";
import { IChat } from "../../../../../common/communication/iChat";

@Injectable({
  providedIn: "root",
})
export class ChatViewService {

  private conversation: IChat[];

  public constructor() {
    this.conversation = [];
  }

  public updateConversation(data: IChat): void {
    this.conversation.push(data);
  }

  public getConversation(): IChat[] {
    this.conversation = [];

    return this.conversation;
  }

  public clearConversations(): void {
    this.conversation = [];
  }
}
