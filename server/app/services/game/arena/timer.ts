import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Constants } from "../../../constants";

export class Timer {

    private secondsSinceStart: number;
    private timerUpdated: Subject<number>;
    private timer: NodeJS.Timeout;

    public constructor() {
        this.secondsSinceStart = 0;
        this.timerUpdated = new Subject<number>();
    }

    public getTimer(): Observable<number> {
        return this.timerUpdated.asObservable();
    }

    public getTimeSinceStart(): number {
        return this.secondsSinceStart;
    }

    public startTimer(): void {
        this.timer = setInterval(
            this.updateTimeSinceStart,
            Constants.ONE_SECOND);
    }

    public stopTimer(): void {
        clearInterval(this.timer);
    }

    public updateTimeSinceStart(): void {
        this.timerUpdated.next(this.secondsSinceStart++);
    }
}
