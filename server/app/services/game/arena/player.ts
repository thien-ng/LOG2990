import { IUser } from "../../../../../common/communication/iUser";

export class Player {

    private _points:        number;
    private isInPenalty:    boolean;

    public constructor(private user: IUser) {
        this._points = 0;
        this.isInPenalty = false;
    }

    public addPoints(pointsEarned: number): void {
        if (pointsEarned > 0) {
            this._points += pointsEarned;
        }
    }

    public setPenaltyState(state: boolean): void {
        this.isInPenalty = state;
    }

    public get penaltyState(): boolean {
        return this.isInPenalty;
    }

    public get userSocketId(): string {
        return this.user.socketID;
    }

    public get username(): string {
        return this.user.username;
    }

    public get points(): number {
        return this._points;
    }
}
