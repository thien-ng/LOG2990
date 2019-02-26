import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Constants } from "../../../constants";
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
    .catch(() => Constants.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageViewComponent);
    fixture.detectChanges();
  });

});
