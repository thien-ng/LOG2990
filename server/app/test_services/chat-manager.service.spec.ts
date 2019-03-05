import { ChatManagerService } from "../services/chat-manager.service";
import { TimeManagerService } from "../services/time-manager.service";
// import sinon = require("sinon");

let chatManagerService: ChatManagerService;
let timeManagerService: TimeManagerService;

beforeEach(() => {
    timeManagerService = new TimeManagerService();
    chatManagerService = new ChatManagerService(timeManagerService);
});

describe("ChatManagerService Tests", () => {

    it ("should return string length of 8 character", (done: Function) => {
        // const socketMock = Mockito.mock(SocketIO);
        // chatManagerService.sendPlayerLogin("test", socketMock, true);

        done();
    });

});
