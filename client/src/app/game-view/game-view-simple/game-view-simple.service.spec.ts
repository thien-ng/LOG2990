
import { TestBed } from "@angular/core/testing";
import { mock } from "ts-mockito";
import { SocketService } from "../../websocket/socket.service";
import { GameViewSimpleService } from "./game-view-simple.service";

// tslint:disable:no-any

describe("GameViewService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: GameViewSimpleService = TestBed.get(GameViewSimpleService);
    expect(service).toBeTruthy();
  });

  it("should send message with socketservice ", () => {
    const mockedSocket: SocketService = mock(SocketService);
    const gameViewSimpleService: GameViewSimpleService = new GameViewSimpleService(mockedSocket);
    const spiedSocket: any = spyOn<any>(mockedSocket, "sendMsg");
    gameViewSimpleService.onCanvasClick(0, 0);

    expect(spiedSocket).toHaveBeenCalled();
  });
});
