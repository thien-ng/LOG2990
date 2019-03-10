export interface Time {
    username: string;
    time: number;
}

export interface Highscore {
    id:             number;
    timesSingle:    [Time, Time, Time];
    timesMulti:     [Time, Time, Time];
}

export enum Position {
    position1 = 0,
    position2 = 1,
    position3 = 2,
}
