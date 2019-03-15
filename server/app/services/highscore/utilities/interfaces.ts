export interface Time {
    username: string;
    time: number;
}

export interface Highscore {
    id:             number;
    timesSingle:    [Time, Time, Time];
    timesMulti:     [Time, Time, Time];
}

export interface HighscoreValidationMessage {
    newValue:   Time;
    mode:       Mode;
    times:      Highscore;
}

export interface SortTimesResponse {
    status: string;
    isNewHighscore: boolean;
    index: Position;
    times: [Time, Time, Time];
}

export interface HighscoreValidationResponse {
    status: string;
    isNewHighscore: boolean;
    index: Position;
    highscore: Highscore;
}

export enum Position {
    position1,
    position2,
    position3,
    notReplaced,
}

export enum Mode {
    Singleplayer,
    Multiplayer,
}
