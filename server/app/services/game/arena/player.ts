import { User } from "../../../../../common/communication/iUser";

export class Player {

    private _points: number;

    public constructor(private user: User) {
        this._points = 0;
        // console.log(this.user);
    }

    public addPoints(pointsEarned: number): void {
        if (pointsEarned > 0) {
            this._points += pointsEarned;
        }
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
