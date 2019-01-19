import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MainNavComponent } from "../main-nav/main-nav.component";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { AdminComponent } from "./admin.component";

const OBLIGATORY_CATCH: String = "obligatory catch";

describe("AdminComponent", () => {
    let component: AdminComponent;
    let fixture: ComponentFixture<AdminComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AdminComponent,
                MainNavComponent,
            ],
            imports: [TestingImportsModule],
        })
            .compileComponents()
            .catch(() => OBLIGATORY_CATCH);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
