export interface CardModel {
    gameID: number;
    title: string;
    subtitle: string;
    avatarImageUrl: string;
    gameImageUrl: string;
    gamemode: GameMode;
  }

  export enum GameMode {
    twoD = 0,
    threeD = 1,
  }