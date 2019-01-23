import { Component, OnInit } from "@angular/core";

import { AdminToggleService } from "../admin-toggle.service";
import { CreateSimpleGameComponent } from "../create-simple-game/create-simple-game.component";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
  entryComponents: [CreateSimpleGameComponent],
})
export class AdminComponent implements OnInit {

  public constructor(public adminService: AdminToggleService) {
    /* default constructor */
  }

  public ngOnInit(): void {
    /* default ngOnInit */
    this.adminService.adminTrue();
  }
}
