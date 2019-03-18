import { TestBed } from "@angular/core/testing";
import { Observable } from "rxjs";
import "rxjs/add/observable/of";
import { mock } from "ts-mockito";
import { GameConnectionService } from "../game-connection.service";
import { ChatViewService } from "../game-view/chat-view/chat-view.service";
import { DifferenceCounterService } from "../game-view/difference-counter/difference-counter.service";
import { GameViewSimpleService } from "../game-view/game-view-simple/game-view-simple.service";
import { TimerService } from "../game-view/timer/timer.service";
import { SocketService } from "./socket.service";
import { GameViewFreeService } from "../game-view/game-view-free/game-view-free.service";

describe("SocketService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: SocketService = TestBed.get(SocketService);
    expect(service).toBeTruthy();
  });
});

describe("SocketService tests", () => {
  let socketService: SocketService;
  let gameConnectionService: GameConnectionService;

  beforeEach(() => {
    gameConnectionService = new GameConnectionService();
    socketService = new SocketService(
      mock(ChatViewService),
      mock(GameViewSimpleService),
      mock(GameViewFreeService),
      mock(TimerService),
      mock(DifferenceCounterService),
      gameConnectionService,
    );
  });

  it("should call socket.emit() when calling sendMsg()", () => {
    spyOn(socketService["socket"], "emit");
    socketService.sendMsg<string>("message", "message body");
    expect(socketService["socket"].emit).toHaveBeenCalled();
  });

  it("should return an Observable when calling onMsg()", () => {
    spyOn(socketService["socket"], "on").and.callThrough().and.returnValue(Observable.of(["message"]));
    socketService.onMsg<string>("message").subscribe( (value) => {
      expect(value).toBe("message");
    });
  });
});
