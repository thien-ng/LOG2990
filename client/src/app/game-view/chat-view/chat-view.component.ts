import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { IChat, IChatSender } from "../../../../../common/communication/iChat";
import { SocketService } from "../../websocket/socket.service";
import { ChatViewService } from "./chat-view.service";

@Component({
  selector:     "app-chat-view",
  templateUrl:  "./chat-view.component.html",
  styleUrls:    ["./chat-view.component.css"],
})

export class ChatViewComponent implements AfterViewChecked, OnDestroy {

  public readonly CHAT_TITLE:             string = "Notification du serveur";
  public readonly CHAT_DESCRIPTION:       string = "クリスチャンサーバー";
  public readonly MESSAGE_PATTERN_REGEX:  string = ".+";
  private readonly CHAT_EVENT:            string = "onChatEvent";

  public conversations:                   IChat[];
  public initialValue:                    string;
  public usernameFormControl:             FormControl;
  public conversationLength:              number;

  @Input()
  private arenaID:                        number;

  @Input()
  private username:                       string;

  @ViewChild("chatBox", {read: ElementRef})
  public chatBox:                         ElementRef;

  public constructor(
    private chatViewService: ChatViewService,
    private socketService: SocketService) {

      this.init();
      this.conversationLength = this.chatViewService.getConversationLength();
  }

  public ngAfterViewChecked(): void {

    if (this.conversationLength < this.chatViewService.getConversationLength()) {
      this.conversationLength = this.chatViewService.getConversationLength();
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }
  }

  private scrollToBottom(): void {
    // const startPositionY: number = this.chatBox.nativeElement.scrollTop;
    // const aimedPosition: number = this.chatBox.nativeElement.scrollHeight;
    const increment: number = 2;

    const interval: NodeJS.Timeout = setInterval(() => {
      if (this.chatBox.nativeElement.scrollTop + increment <= this.chatBox.nativeElement.scrollHeight) {
        // fdgd
        this.chatBox.nativeElement.scrollTop += increment;
      } else {
        clearInterval(interval);
      }
    }, 100);
  }

  public init(): void {
    this.initialValue = "";
    this.conversations = this.chatViewService.getConversation();
    this.usernameFormControl = new FormControl("", [
      Validators.required,
      Validators.pattern(this.MESSAGE_PATTERN_REGEX),
    ]);
  }

  public ngOnDestroy(): void {
    this.chatViewService.clearConversations();
  }

  public sendMessage(): void {
    if (this.usernameFormControl.errors === null) {

      const generatedMessage: IChatSender = this.generateMessage(this.usernameFormControl.value);
      this.socketService.sendMsg(this.CHAT_EVENT, generatedMessage);
      this.initialValue = "";
    }
  }

  private generateMessage(data: string): IChatSender {
    return {
      arenaID:  this.arenaID,
      username: this.username,
      message:  data,
    } as IChatSender;
  }

}
