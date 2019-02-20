import { TestBed } from "@angular/core/testing";
import { IPlayerInputResponse } from "../../../../../common/communication/iGameplay";
import { ChatViewService } from "./chat-view.service";

const chatViewService: ChatViewService = new ChatViewService();
const mockIPlayerInputResponse: IPlayerInputResponse = {
  status: "onFailedClick",
  response: {
    differenceKey: -1,
    cluster: [],
  },
};

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

  it("should clear IChat data in array", () => {
    chatViewService = new ChatViewService();
    const mockIChat: IChat = {
      username: "userType",
      message: "message",
      time: "time",
    };

    chatViewService.updateConversation(mockIChat);
    chatViewService.clearConversations();
    expect(chatViewService.getConversation().length).toBe(0);
  });

});
