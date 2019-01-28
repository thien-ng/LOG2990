export interface Highscore {
    id: number,
    timesSingle: number[],
    timesMulti: number[],
  }

export enum Mode{
    Singleplayer,
    Multiplayer,
}