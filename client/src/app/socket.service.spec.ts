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
    spyOn(socketService["socket"], "emit").and.callThrough();
    socketService.sendMsg<string>("string", "message bidon qui ne s'enverra nulle part");
    expect(socketService["socket"].emit).toHaveBeenCalled();
  });

  // it("should call socket.on() when calling sendMsg()", () => {
  //   spyOn(socketService["socket"], "on");
  //   socketService.onMsg<string>("string");
  //   expect(socketService["socket"].on).toHaveBeenCalledWith("string", "data");
  // });

  it("should return an Observable when calling sendMsg()", () => {
    spyOn(socketService["socket"], "on").and.callThrough().and.returnValue(Observable.of(["string"]));
    socketService.onMsg<string>("string").subscribe( (value) => {
      expect(value).toBe("a string because I'm waiting an observable of a string here");
    });
    expect(socketService["socket"].on).toHaveBeenCalled();
  });
});
