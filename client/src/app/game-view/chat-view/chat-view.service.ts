import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { IChat } from "../../../../../common/communication/iChat";

@Injectable({
  providedIn: "root",
})
export class ChatViewService {

  private readonly INVALID_CHAT_MESSAGE: string = "  vient de se déconnecter.";

  private conversation: IChat[];
  private chatFocus:    Subject<boolean>;
  private chatUpdate:   Subject<boolean>;

  public constructor() {
    this.conversation = [];
    this.chatFocus  = new Subject<boolean>();
    this.chatUpdate = new Subject<boolean>();
  }

  public updateConversation(data: IChat): void {
    if (data.message !== this.INVALID_CHAT_MESSAGE) {
      this.conversation.push(data);
    }
  }

  public getConversation(): IChat[] {
    this.conversation = [];

    return this.conversation;
  }

  public clearConversations(): void {
    this.conversation = [];
    this.chatUpdate.next(true);
  }

  public getConversationLength(): number {
    return this.conversation.length;
  }

  public getChatFocusListener(): Observable<boolean> {
    return this.chatFocus.asObservable();
  }

  public updateChatFocus(value: boolean): void {
    this.chatFocus.next(value);
  }

  public getChatUpdateListener(): Observable<boolean> {
    return this.chatUpdate.asObservable();
  }

}
