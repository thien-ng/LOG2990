import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CardComponent } from "../card/card.component";
import { Constants } from "../constants";
import { CreateSimpleGameComponent } from "../create-simple-game/create-simple-game.component";
import { GameListContainerComponent } from "../game-list-container/game-list-container.component";
import { GameListComponent } from "../game-list/game-list.component";
import { HighscoreDisplayComponent } from "../highscore-display/highscore-display.component";
import { MainNavComponent } from "../main-nav/main-nav.component";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { AdminComponent } from "./admin.component";

describe("AdminComponent", () => {
    let component: AdminComponent;
    let fixture: ComponentFixture<AdminComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AdminComponent,
                MainNavComponent,
                CreateSimpleGameComponent,
                GameListContainerComponent,
                GameListComponent,
                CardComponent,
                HighscoreDisplayComponent,
            ],
            imports: [TestingImportsModule],
        })
            .compileComponents()
            .catch(() => Constants.OBLIGATORY_CATCH);
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
