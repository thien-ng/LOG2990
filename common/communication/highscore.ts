export interface Highscore {
    id:             number,
    timesSingle:    [Time, Time, Time],
    timesMulti:     [Time, Time, Time],
}

export interface HighscoreMessage {
    id:             number,
    timesSingle:    [StringFormatedTime, StringFormatedTime, StringFormatedTime],
    timesMulti:     [StringFormatedTime, StringFormatedTime, StringFormatedTime],
}

export interface Time {
    username:   string,
    time:       number,
}

export interface StringFormatedTime {
    username:   string,
    time:       string,
}

export interface HighscoreValidationMessage {
    newValue:   Time,
    mode:       Mode,
    times:      Highscore,
}

export interface HighscoreValidationStatus { 
    status: string,
    result: Highscore | string,
}

export enum Mode {
    Singleplayer,
    Multiplayer,
}

export enum Position {
    position1,
    position2,
    position3,
}
