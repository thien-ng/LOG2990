import { TestBed } from "@angular/core/testing";
import { Observable } from "rxjs";
import "rxjs/add/observable/of";
import { SocketService } from "./socket.service";

describe("SocketService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: SocketService = TestBed.get(SocketService);
    expect(service).toBeTruthy();
  });
});

describe("SocketService tests", () => {
  let socketService: SocketService;

  beforeEach(() => {
    socketService = new SocketService();
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
