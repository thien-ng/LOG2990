import { Injectable } from '@angular/core';
import { IChat } from "../../../../../common/communication/iChat";

@Injectable({
  providedIn: 'root'
})
export class ChatViewService {
  
  private conversation: IChat[] = [
    {userType: "server", message: "test1"},
    {userType: "server", message: "test2"},
    {userType: "server", message: "test3"},
    {userType: "server", message: "test4"},
    {userType: "server", message: "test5"},
    {userType: "server", message: "test5"},
    {userType: "server", message: "test5"},
    {userType: "server", message: "test5"},
  ];

  constructor() { }

  public getConversation(): IChat[] {
    return this.conversation;
  }

}
