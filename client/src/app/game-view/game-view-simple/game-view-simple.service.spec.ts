
import { TestBed } from "@angular/core/testing";
import { SocketService } from "../../websocket/socket.service";
import { GameViewSimpleService } from "./game-view-simple.service";
import { mock } from "ts-mockito";

describe("GameViewService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: GameViewSimpleService = TestBed.get(GameViewSimpleService);
    expect(service).toBeTruthy();
  });

  it("should send message with socketservice ", () => {
    const gameViewSimpleService: GameViewSimpleService = new GameViewSimpleService(mock(SocketService));
    const spiedMethod = spyOn<any>(gameViewSimpleService, "sendMessage");
    gameViewSimpleService.onCanvasClick(0,0);

    expect(spiedMethod).toHaveBeenCalled();
    
  });
});
