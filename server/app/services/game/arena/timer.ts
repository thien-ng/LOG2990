import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { CServer } from "../../../CServer";

export class Timer {

    private secondsSinceStart:  number;
    private timerUpdated:       Subject<number>;
    private timer:              NodeJS.Timeout | null;

    public constructor() {
        this.timer = null;
        this.secondsSinceStart  = 0;
        this.timerUpdated       = new Subject<number>();
    }

    public getTimer(): Observable<number> {
        return this.timerUpdated.asObservable();
    }

    public getTimeSinceStart(): number {
        return this.secondsSinceStart;
    }

    public startTimer(): void {
        if (this.timer === null) {
            this.timer = setInterval(
                () => {
                    this.updateTimeSinceStart();
                },
                CServer.ONE_SECOND);
        }
    }

    public stopTimer(): number {
        if (this.timer !== null) {
            clearInterval(this.timer);
        }
        this.timer = null;

        return this.secondsSinceStart;
    }

    public updateTimeSinceStart(): void {
        this.timerUpdated.next(++this.secondsSinceStart);
    }
}
