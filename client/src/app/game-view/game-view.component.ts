import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

let x = 0;
let y = 0;

@Component({
  selector: "app-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.css"],
})

export class GameViewComponent implements OnInit {

  @ViewChild('originalImage', {read: ElementRef}) canvasOriginal: ElementRef;
  @ViewChild('modifiedImage', {read: ElementRef}) canvasModified: ElementRef;

  public constructor() {
    // default constructor
    
  }

  public ngOnInit(): void  {
    // default ngOnInit
  }

  public async getMousePosition(): Promise<void> {
    await this.canvasOriginal.nativeElement.addEventListener("click", (e: MouseEvent) => {
      x = e.offsetX;
      y = e.offsetY;

      
    });  
    console.log("x: " + x + " y: " + y);
  }
}
