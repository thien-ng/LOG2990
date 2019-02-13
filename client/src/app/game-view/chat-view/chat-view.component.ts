import { Component } from "@angular/core";
import { IChat } from "../../../../../common/communication/iChat";
import { ChatViewService } from "./chat-view.service";

@Component({
  selector: "app-chat-view",
  templateUrl: "./chat-view.component.html",
  styleUrls: ["./chat-view.component.css"],
})
export class ChatViewComponent {

  public readonly CHAT_TITLE: string = "Notification du serveur";
  public readonly CHAT_DESCRIPTION: string = "クリスチャンサーバー";

  public conversations: IChat[];

  public constructor(private chatViewService: ChatViewService) {
    this.conversations = this.chatViewService.getConversation();
  }

}
