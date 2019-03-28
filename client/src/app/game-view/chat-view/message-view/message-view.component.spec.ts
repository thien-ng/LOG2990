import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CClient } from "../../../CClient";
import { TestingImportsModule } from "../../../testing-imports/testing-imports.module";
import { MessageViewComponent } from "./message-view.component";

describe("MessageViewComponent", () => {
  let fixture: ComponentFixture<MessageViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageViewComponent ],
      imports:      [ TestingImportsModule ],
    })
    .compileComponents()
    .catch(() => CClient.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageViewComponent);
    fixture.detectChanges();
  });

});
