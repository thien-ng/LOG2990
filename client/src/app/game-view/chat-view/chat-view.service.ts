import { Injectable } from '@angular/core';
import { IChat } from "../../../../../common/communication/iChat";

@Injectable({
  providedIn: 'root'
})
export class ChatViewService {
  
  private conversation: IChat[] = [];

  constructor() {
    // default constructor
  }

  public recoverConversation(data: IChat): void {
    this.conversation.unshift(data);
  }

  public bindConversation(): IChat[] {
    return this.conversation;
  }

}
