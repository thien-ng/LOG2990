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

  public  readonly CHAT_TITLE:            string = "Boîte de messagerie";
  public  readonly CHAT_DESCRIPTION:      string = "Message sur serveur et des joueurs";
  public  readonly MESSAGE_PATTERN_REGEX: string = ".+";
  private readonly CHAT_EVENT:            string = "onChatEvent";
  private readonly SCROLL_DURATION_MS:    number = 250;

  public conversations:                   IChat[];
  public initialValue:                    string;
  public usernameFormControl:             FormControl;
  public conversationLength:              number;

  @Input()
  private arenaID:                        number;

  @Input()
  private username:                       string;

  private conversationIsEmpty:            boolean;
  private chatHeight:                     number;

  @ViewChild("chatBox", {read: ElementRef})
  public chatBox:                         ElementRef;

  public constructor(
    private chatViewService:      ChatViewService,
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

    const distanceToScroll:       number          = chatBoxDiv.scrollHeight - this.chatHeight - chatBoxDiv.scrollTop;
    const distanceDivider:        number          = 25;
    const increment:              number          = distanceToScroll / distanceDivider;

    const pauseBetweenIncrement:  number          = (this.SCROLL_DURATION_MS * increment) / distanceToScroll;
    const interval:               NodeJS.Timeout  = setInterval(
      () => {
      const scrollPosition: number = chatBoxDiv.scrollTop + this.chatHeight;
      // const maxOffset: number = this.chatBox.nativeElement.scrollTop + this.chatHeight;
      // si sT + cH + increment < sH, on incrémente, sinon on stoppe
      if (scrollPosition + increment <= chatBoxDiv.scrollHeight) {
        chatBoxDiv.scrollTop += increment;
      } else {
        chatBoxDiv.scrollTop = chatBoxDiv.scrollHeight;
        clearInterval(interval);
      }
    },
      pauseBetweenIncrement);
  }

  public printDummyMessage(): void {
    // console.log("Scroll height au depart: " + this.chatBox.nativeElement.scrollHeight);
    // const generatedMessage: IChatSender = this.generateMessage("Salut je m'appelle allo");
    const message: IChat = {
      username:   "pet",
      message:    "Salut je m'appelle allo",
      time:       "13:45",
  };
    this.chatViewService.updateConversation(message);
  }

  public init(): void {
    this.initialValue         = "";
    this.conversations        = this.chatViewService.getConversation();
    this.usernameFormControl  = new FormControl("", [
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
