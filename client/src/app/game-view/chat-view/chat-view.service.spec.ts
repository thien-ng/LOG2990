import { TestBed } from "@angular/core/testing";
import { IChat } from "../../../../../common/communication/iChat";
import { ChatViewService } from "./chat-view.service";

// tslint:disable:no-magic-numbers no-any

let chatViewService:          ChatViewService       = new ChatViewService();
const mockIChat:              IChat                 = {
  username: "SERVEUR",
  message:  "message",
  time:     "time",
};

describe("ChatViewService Test", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ChatViewService = TestBed.get(ChatViewService);
    expect(service).toBeTruthy();
  });

  it("should add IChat data in array when update is called", () => {
    chatViewService.updateConversation(mockIChat);
    expect(chatViewService.getConversation().length).toBe(0);
  });

  it("should ignore invalid message when updating chat", () => {
    const mockIChatInvalid: IChat = {
      username: "SERVEUR",
      message:  "message",
      time:     "time",
    };
    mockIChatInvalid.message = "  vient de se déconnecter.";
    chatViewService.updateConversation(mockIChatInvalid);
    expect(chatViewService.getConversation().length).toBe(0);
  });

  it("should clear IChat data in array when clearConversations is called", () => {
    chatViewService.updateConversation(mockIChat);
    chatViewService.clearConversations();
    expect(chatViewService.getConversation().length).toBe(0);
  });

  it("should return 1 for lenght of chat after 1 update", () => {
    chatViewService = new ChatViewService();
    chatViewService.updateConversation(mockIChat);
    expect(chatViewService.getConversationLength()).toBe(1);
  });

  it("should return 4 for length of chat after 4 updates", () => {
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
