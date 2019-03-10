export interface Highscore {
    id:             number,
    timesSingle:    [Time, Time, Time],
    timesMulti:     [Time, Time, Time],
  }

export interface HighscoreMessage {
    id:             number,
    timesSingle:    [TimeMessage, TimeMessage, TimeMessage],
    timesMulti:     [TimeMessage, TimeMessage, TimeMessage],
}

export interface Time {
    username:   string,
    time:       number,
}

export interface TimeMessage {
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
    position1 = 0,
    position2 = 1,
    position3 = 2,
}
