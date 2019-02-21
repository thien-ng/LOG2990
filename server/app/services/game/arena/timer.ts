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

    public startTimer(): void {
        this.timer = setInterval(
        () => {
                this.timerUpdated.next(this.secondsSinceStart++);
            },
        Constants.ONE_SECOND);
    }

    public stopTimer(): void {
        clearInterval(this.timer);
    }
}
