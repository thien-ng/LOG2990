import { Component } from '@angular/core';
import { ChatViewService } from "./chat-view.service";
import { IChat } from "../../../../../common/communication/iChat";

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css']
})
export class ChatViewComponent {

  public conversations: IChat[] = [];

  constructor(private chatViewService: ChatViewService) {
    // default constructor
    this.conversations = this.chatViewService.bindConversation();
  }

}
