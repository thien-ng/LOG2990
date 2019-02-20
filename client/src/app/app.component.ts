import { Component, Inject } from "@angular/core";
import { SocketService } from "./websocket/socket.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {

  public constructor(@Inject(SocketService) private socketService: SocketService) {
    this.socketService.initWebsocketListener();
  }
}
