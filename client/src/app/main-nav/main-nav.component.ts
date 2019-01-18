import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.css"],
})

export class MainNavComponent {

 // TBD : String magique in array ??

  public routes: Array<Object> = [
    { linkName: "Liste des jeux", url: "/nav/gamelist" },
    { linkName: "Administration", url: "/admin" },
  ];

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
    );

  public constructor(private breakpointObserver: BreakpointObserver) { }
}
