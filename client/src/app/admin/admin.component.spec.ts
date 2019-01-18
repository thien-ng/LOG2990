import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";

import { MainNavComponent } from "../main-nav/main-nav.component";
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
            imports: [
                BrowserAnimationsModule,
                MatToolbarModule,
                MatIconModule,
                MatListModule,
                MatSidenavModule,
                RouterTestingModule,
            ],
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
