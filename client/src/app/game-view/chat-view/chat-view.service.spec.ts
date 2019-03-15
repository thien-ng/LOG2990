import { TestBed } from "@angular/core/testing";
import { IChat } from "../../../../../common/communication/iChat";
import { ChatViewService } from "./chat-view.service";

// tslint:disable:no-magic-numbers no-any

let chatViewService:          ChatViewService       = new ChatViewService();
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

  it("should return 1 for lenght of chat", () => {
    chatViewService.updateConversation(mockIChat);
    expect(chatViewService.getConversationLength()).toBe(1);
  });

  it("should return 4 for length of chat", () => {
    chatViewService = new ChatViewService();
    chatViewService.updateConversation(mockIChat);
    chatViewService.updateConversation(mockIChat);
    chatViewService.updateConversation(mockIChat);
    chatViewService.updateConversation(mockIChat);
    expect(chatViewService.getConversationLength()).toBe(4);
  });

  it("should return an boolean observable", () => {
    chatViewService.getChatFocusListener().subscribe((newValue: boolean) => {
      expect(newValue).toBe(true);
    });

    chatViewService.updateChatFocus(true);
  });

});
