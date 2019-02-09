import { TestBed } from "@angular/core/testing";

import { ChatViewService } from "./chat-view.service";

describe("ChatViewService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ChatViewService = TestBed.get(ChatViewService);
    expect(service).toBeTruthy();
  });
});
