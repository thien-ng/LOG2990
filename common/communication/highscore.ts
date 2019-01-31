export interface Highscore {
    id: number,
    timesSingle: [number, number, number],
    timesMulti: [number, number, number],
  }

export enum Mode{
    Singleplayer,
    Multiplayer,
}