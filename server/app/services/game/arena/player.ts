import { IUser } from "../../../../../common/communication/iUser";

export class Player {

    private points:         number;
    private isReady:        boolean;
    private isInPenalty:    boolean;

    public constructor(private user: IUser) {
        this.points      = 0;
        this.isReady     = false;
        this.isInPenalty = false;
    }

    public addPoints(pointsEarned: number): void {
        if (pointsEarned > 0) {
            this.points += pointsEarned;
        }
    }

    public setPlayerState(state: boolean): void {
        this.isReady = state;
    }

    public setPenaltyState(state: boolean): void {
        this.isInPenalty = state;
    }

    public getPlayerIsReady(): boolean {
        return this.isReady;
    }

    public getPenaltyState(): boolean {
        return this.isInPenalty;
    }

    public getUserSocketId(): string {
        return this.user.socketID;
    }

    public getUsername(): string {
        return this.user.username;
    }

    public getPoints(): number {
        return this.points;
    }
}
