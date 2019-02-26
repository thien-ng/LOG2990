import { TestBed } from "@angular/core/testing";
import { IPlayerInputResponse } from "../../../../../common/communication/iGameplay";
import { ChatViewService } from "./chat-view.service";

const chatViewService:          ChatViewService       = new ChatViewService();
const mockIPlayerInputResponse: IPlayerInputResponse  = {
  status:   "onFailedClick",
  response: {
    differenceKey:  -1,
    cluster:        [],
  },
};

describe("ChatViewService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ChatViewService = TestBed.get(ChatViewService);
    expect(service).toBeTruthy();
  });

  it("should add IChat data in array", () => {
    chatViewService.updateConversation(mockIPlayerInputResponse);
    expect(chatViewService.getConversation()[0].username).toBe("SERVEUR");
  });

  it("should clear IChat data in array", () => {
    chatViewService.updateConversation(mockIPlayerInputResponse);
    chatViewService.clearConversations();
    expect(chatViewService.getConversation().length).toBe(0);
  });
});
