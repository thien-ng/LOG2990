import { Component, ElementRef, OnDestroy, ViewChild, AfterViewChecked } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { IChat } from "../../../../../common/communication/iChat";
import { SocketService } from "../../websocket/socket.service";
import { ChatViewService } from "./chat-view.service";

@Component({
  selector:     "app-chat-view",
  templateUrl:  "./chat-view.component.html",
  styleUrls:    ["./chat-view.component.css"],
})
export class ChatViewComponent implements AfterViewChecked, OnDestroy {

  public readonly CHAT_TITLE:       string = "Notification du serveur";
  public readonly CHAT_DESCRIPTION: string = "クリスチャンサーバー";
  public readonly MESSAGE_PATTERN:  string = "/^[^_\s]*$/";

  public conversations: IChat[];
  public initialValue: string;

  @ViewChild("chat", {read: ElementRef})
  public chatBox:  ElementRef;

  public ngAfterViewChecked(): void {
    this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
  }

  public usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(this.MESSAGE_PATTERN),
  ]);

  public constructor(
    private chatViewService: ChatViewService,
    private socketService: SocketService) {
    this.initialValue = "";
    this.conversations = this.chatViewService.getConversation();
  }

  public ngOnDestroy(): void {
    this.chatViewService.clearConversations();
  }

  public sendMessage(): void {
    this.socketService.sendMsg("test", this.usernameFormControl.value);
    this.initialValue = "";
  }

}
