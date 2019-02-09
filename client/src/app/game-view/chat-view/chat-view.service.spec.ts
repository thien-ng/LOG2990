import { TestBed } from "@angular/core/testing";
import { IChat } from "../../../../../common/communication/iChat";
import { ChatViewService } from "./chat-view.service";

let chatViewService: ChatViewService;

describe("ChatViewService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ChatViewService = TestBed.get(ChatViewService);
    expect(service).toBeTruthy();
  });

  it("should add IChat data in array", () => {
    chatViewService = new ChatViewService();
    const mockIChat: IChat = {
      username: "userType",
      message: "message",
      time: "time",
    };

    chatViewService.updateConversation(mockIChat);
    expect(chatViewService.getConversation()[0]).toBe(mockIChat);
  });

});
