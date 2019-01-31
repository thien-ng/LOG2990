export interface Highscore {
    id: number,
    timesSingle: [number, number, number],
    timesMulti: [number, number, number],
  }

export interface HighscoreMessage {
    id: number,
    timeSingle: [string, string, string],
    timesMulti: [string, string, string],
}

export enum Mode{
    Singleplayer,
    Multiplayer,
}