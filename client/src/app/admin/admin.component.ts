import { Component, OnInit } from "@angular/core";

import { CreateSimpleGameComponent } from "../create-simple-game/create-simple-game.component";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
  entryComponents: [CreateSimpleGameComponent],
})
export class AdminComponent implements OnInit {

  public constructor() {
    /* default constructor */
  }

  public ngOnInit(): void {
    /* default ngOnInit */
  }
}
