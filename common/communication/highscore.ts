// const FIRST_PLACE: number = 0;
// const SECOND_PLACE: number = 1;
// const THIRD_PLACE: number = 2;

export interface Highscore {
    timesSingle: number[];
    timesMulti: number[];
  }

export enum Mode{
    Singleplayer,
    Multiplayer,
}