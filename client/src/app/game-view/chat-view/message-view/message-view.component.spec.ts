import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Constants } from "../../../constants";
import { MessageViewComponent } from "./message-view.component";
import { TestingImportsModule } from "../../../testing-imports/testing-imports.module";

describe("MessageViewComponent", () => {
  let component: MessageViewComponent;
  let fixture: ComponentFixture<MessageViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageViewComponent ],
      imports: [
        TestingImportsModule,
      ],
    })
    .compileComponents()
    .catch(() => Constants.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
