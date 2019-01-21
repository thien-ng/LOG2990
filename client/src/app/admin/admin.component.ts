import { Component, OnInit } from "@angular/core";

import { FormulaireJeuSimpleComponent } from "../formulaire-jeu-simple/formulaire-jeu-simple.component";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
  entryComponents: [FormulaireJeuSimpleComponent],
})
export class AdminComponent implements OnInit {
  public constructor() {
    /* default constructor */
  }

  public ngOnInit(): void {
    /* default ngOnInit */
  }

}
