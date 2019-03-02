import { injectable } from "inversify";

@injectable()
export class TimeManagerService {

    public getTimeNow(): string {

        const dateNow: Date = new Date();

        const hour: number = dateNow.getHours();
        const minute: number = dateNow.getMinutes();

        const newMinute: string = this.isSingleDigit(hour);
        const newSecond: string = this.isSingleDigit(minute);

        return newMinute + ":" + newSecond;
    }

    private isSingleDigit(time: number): string {

        const stringTime: string = time.toString();

        return (stringTime.length == 1) ? "0" + stringTime : stringTime;
    }
}