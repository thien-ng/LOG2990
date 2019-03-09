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

export enum Mode{
    Singleplayer,
    Multiplayer,
}
