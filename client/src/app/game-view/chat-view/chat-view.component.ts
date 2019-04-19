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

  @ViewChild("chatBox", {read: ElementRef}) public chatBox: ElementRef;

  @Input() private arenaID:               number;
  @Input() private username:              string;
  @Input() public  isGameEnded: boolean;

  public  readonly CHAT_TITLE:            string = "Boîte de messagerie";
  public  readonly CHAT_DESCRIPTION:      string = "Message sur serveur et des joueurs";
  public  readonly MESSAGE_PATTERN_REGEX: string = ".+";
  private readonly CHAT_EVENT:            string = "onChatEvent";
  private readonly SCROLL_DURATION_MS:    number = 200;

  private conversationIsEmpty:            boolean;
  private chatHeight:                     number;

  public conversations:                   IChat[];
  public initialValue:                    string;
  public usernameFormControl:             FormControl;
  public conversationLength:              number;

  public constructor(
    public  chatViewService:      ChatViewService,
    private socketService:        SocketService) {
      this.init();
      this.conversationLength   = this.chatViewService.getConversationLength();
      this.conversationIsEmpty  = true;
  }

  public ngAfterViewChecked(): void {
    if (this.conversationLength < this.chatViewService.getConversationLength()) {
      this.conversationLength = this.chatViewService.getConversationLength();
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    const chatBoxDiv: HTMLDivElement = this.chatBox.nativeElement;

    if (this.conversationIsEmpty) {
      this.chatHeight = chatBoxDiv.scrollHeight;
      this.conversationIsEmpty = false;
    }
    const DISTANCE_DIVIDER:       number  = 25;
    const distanceToScroll:       number  = chatBoxDiv.scrollHeight - this.chatHeight - chatBoxDiv.scrollTop;
    const increment:              number  = distanceToScroll / DISTANCE_DIVIDER >= 1 ? distanceToScroll / DISTANCE_DIVIDER : 1;
    const pauseBetweenIncrement:  number  = (this.SCROLL_DURATION_MS * increment) / distanceToScroll;

    const interval: NodeJS.Timeout  = setInterval(
      () => {
      const scrollPosition: number = chatBoxDiv.scrollTop + this.chatHeight;
      if (scrollPosition + increment <= chatBoxDiv.scrollHeight) {
        chatBoxDiv.scrollTop += increment;
      } else {
        chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;
        clearInterval(interval);
      }
    },
      pauseBetweenIncrement);
  }

  public init(): void {
    this.initialValue         = "";
    this.conversations        = this.chatViewService.getConversation();
    this.usernameFormControl  = new FormControl("", [
      Validators.pattern(this.MESSAGE_PATTERN_REGEX),
    ]);
    this.chatViewService.getChatUpdateListener().subscribe((value: boolean) => {
      if (value) {
        this.conversations = this.chatViewService.getConversation();
      }
    });
  }

  public ngOnDestroy(): void {
    this.chatViewService.clearConversations();
  }

  public sendMessage(): void {
    if (this.usernameFormControl.errors === null) {
      const generatedMessage: IChatSender = this.generateMessage(this.usernameFormControl.value);
      this.socketService.sendMessage(this.CHAT_EVENT, generatedMessage);
      this.initialValue = "";
    }
  }

  public onFocus(): void {
    this.chatViewService.updateChatFocus(true);
  }

  public onBlur(): void {
    this.chatViewService.updateChatFocus(false);
  }

  private generateMessage(data: string): IChatSender {
    return {
      arenaID:  this.arenaID,
      username: this.username,
      message:  data,
    } as IChatSender;
  }
}
