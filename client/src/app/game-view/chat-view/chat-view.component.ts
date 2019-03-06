import { AfterViewChecked, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
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

  private readonly CHAT_EVENT:      string = "onChatEvent";

  public conversations: IChat[];
  public initialValue: string;
  public usernameFormControl: FormControl;

  @ViewChild("chat", {read: ElementRef})
  public chatBox:  ElementRef;

  public ngAfterViewChecked(): void {
    this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
  }

  public constructor(
    private chatViewService: ChatViewService,
    private socketService: SocketService) {

      this.init();
  }

  public init(): void {
    this.initialValue = "";
    this.conversations = this.chatViewService.getConversation();
    this.usernameFormControl = new FormControl("", [
      Validators.required,
      Validators.pattern(this.MESSAGE_PATTERN),
    ]);
  }

  public ngOnDestroy(): void {
    this.chatViewService.clearConversations();
  }

  public sendMessage(): void {
    this.socketService.sendMsg(this.CHAT_EVENT, this.usernameFormControl.value);
    this.initialValue = "";
  }

}
