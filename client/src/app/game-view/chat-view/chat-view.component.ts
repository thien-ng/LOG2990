import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { IChat, IChatSender } from "../../../../../common/communication/iChat";
import { SocketService } from "../../websocket/socket.service";
import { ChatViewService } from "./chat-view.service";

@Component({
  selector:     "app-chat-view",
  templateUrl:  "./chat-view.component.html",
  styleUrls:    ["./chat-view.component.css"],
})

export class ChatViewComponent implements AfterViewChecked, OnDestroy, AfterViewInit {

  public readonly CHAT_TITLE:             string = "Boîte de messagerie";
  public readonly CHAT_DESCRIPTION:       string = "Message sur serveur et des joueurs";
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

  private chatHeight: number;

  @ViewChild("chatBox", {read: ElementRef})
  public chatBox:                         ElementRef;

  public constructor(
    private chatViewService: ChatViewService,
    private socketService: SocketService) {

      this.init();
      this.conversationLength = this.chatViewService.getConversationLength();
  }

  public ngAfterViewInit(): void {
    this.chatHeight = this.chatBox.nativeElement.scrollHeight;
    // console.log("ChatHeight : " + this.chatHeight);
  }
  public ngAfterViewChecked(): void {

    if (this.conversationLength < this.chatViewService.getConversationLength()) {
      this.conversationLength = this.chatViewService.getConversationLength();
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    const increment: number = 5;
    const pauseBetweenIncrement: number = 7;

    const interval: NodeJS.Timeout = setInterval(() => {
      if (this.chatBox.nativeElement.scrollTop + increment <= this.chatBox.nativeElement.scrollHeight) {
        this.chatBox.nativeElement.scrollTop += increment;
      } else {
        clearInterval(interval);
      }

    }, pauseBetweenIncrement);
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
