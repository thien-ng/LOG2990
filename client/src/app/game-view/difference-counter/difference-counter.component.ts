import { AfterContentInit, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { INewScore } from "../../../../../common/communication/iGameplay";
import { DifferenceCounterService } from "./difference-counter.service";

@Component({
  selector: "app-difference-counter",
  templateUrl: "./difference-counter.component.html",
  styleUrls: ["./difference-counter.component.css"],
})
export class DifferenceCounterComponent implements AfterContentInit {

  @ViewChild("counter",       {read: ElementRef})  public counter: ElementRef;

  @Input() private username:  string;
  @Input() private isLeft:    boolean;
  @Input() private mode:      number;

  public readonly DEFAULT_NB_ERROR_FOUND: number = 0;
  public readonly NB_ERROR_MAX_SINGLE:    number = 7;
  public readonly NB_ERROR_MAX_MULTI:     number = 4;

  public valueUser:                       number;
  public maxError:                        number;

  public constructor( private differenceCounterService: DifferenceCounterService) {
    this.valueUser = 0;
    this.isLeft   = false;
