import { TestBed } from "@angular/core/testing";
import { IChat } from "../../../../../common/communication/iChat";
import { ChatViewService } from "./chat-view.service";

const chatViewService:          ChatViewService       = new ChatViewService();
const mockIChat:                IChat                 = {
  username: "SERVEUR",
  message: "message",
  time: "time",
};

describe("ChatViewService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ChatViewService = TestBed.get(ChatViewService);
    expect(service).toBeTruthy();
  });

  it("should add IChat data in array", () => {
    chatViewService.updateConversation(mockIChat);
    expect(chatViewService.getConversation().length).toBe(0);
  });

  it("should clear IChat data in array", () => {
    chatViewService.updateConversation(mockIChat);
    chatViewService.clearConversations();
    expect(chatViewService.getConversation().length).toBe(0);
  });
});
