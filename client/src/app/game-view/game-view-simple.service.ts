import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})

export class GameViewSimpleService {

  public constructor() {
    // default constructor
  }

  public onCanvasClick(x: number, y: number): void {
    console.log("x: " + x + " y: " + y);
  }

}
