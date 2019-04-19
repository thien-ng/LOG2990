import { Component, Input } from "@angular/core";
import { IChat } from "../../../../../../common/communication/iChat";

@Component({
  selector:     "app-message-view",
  templateUrl:  "./message-view.component.html",
  styleUrls:    ["./message-view.component.css"],
})
export class MessageViewComponent {

  @Input() public chatMessage: IChat;

}
