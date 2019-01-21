import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { Component } from "@angular/core";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { NavButton } from "./nav-button.interface";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.css"],
})
export class MainNavComponent {
  // TBD : String magic in array ??

  public routes: NavButton[] = [
    { linkName: "Liste des jeux", url: "/nav/gamelist" },
    { linkName: "Administration", url: "/admin" },
  ];

  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((event) => event.matches));

  public constructor(private breakpointObserver: BreakpointObserver) {}
}
