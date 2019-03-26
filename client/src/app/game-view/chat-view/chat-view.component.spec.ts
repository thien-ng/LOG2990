import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CClient } from "../../CClient";
import { TestingImportsModule } from "../../testing-imports/testing-imports.module";
import { ChatViewComponent } from "./chat-view.component";
import { MessageViewComponent } from "./message-view/message-view.component";

describe("ChatViewComponent", () => {
  let fixture:    ComponentFixture<ChatViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChatViewComponent,
        MessageViewComponent,
      ],
      imports: [
        TestingImportsModule,
      ],
    })
    .compileComponents()
    .catch(() => CClient.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(ChatViewComponent);
    fixture.detectChanges();
  });
});
