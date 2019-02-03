import { TestBed } from "@angular/core/testing";
import { Observable } from "rxjs";
import "rxjs/add/observable/of";
// import * as io from "socket.io-client";
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
  // let socket: SocketIOClient.Socket;

  beforeEach(() => {
    // socket = io("http://url bidon/");
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
  //   expect(socketService["socket"].on).toHaveBeenCalled();
  // });

  it("should return an Observable when calling sendMsg()", () => {
    spyOn(socketService["socket"], "on").and.returnValue(Observable.of(["string"]));
    socketService.onMsg<string>("string").subscribe( (value) => {
      expect(value).toBe("blabla value");
    });
  });
});
