import { AfterContentInit, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { DiffCounterService } from "./diff-counter.service";
@Component({
  selector: "app-diff-counter",
  templateUrl: "./diff-counter.component.html",
  styleUrls: ["./diff-counter.component.css"],
  providers: [DiffCounterService],
})
export class DiffCounterComponent implements AfterContentInit {
  @ViewChild("progressCircle", { read: ElementRef })
  public progressCircle: ElementRef;
  @ViewChild("progressBar", { read: ElementRef })
  public progressBar: ElementRef;

  public constructor(@Inject(DiffCounterService) public diffCounterService: DiffCounterService) {
    // default constructor
  }

  public ngAfterContentInit(): void {
    this.diffCounterService = new DiffCounterService(this.progressCircle, this.progressBar);

    this.diffCounterService.updateSpinner(2);
  }

}
