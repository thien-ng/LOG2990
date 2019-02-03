import { TestBed } from "@angular/core/testing";
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

  it("should have called socket.emit() when calling sendMsg()", () => {
    spyOn(socketService["socket"], "emit").and.callThrough();
    socketService.sendMsg<string>("string", "message bidon qui ne s'enverra nulle part");
    expect(socketService["socket"].emit).toHaveBeenCalled();
  });
});
