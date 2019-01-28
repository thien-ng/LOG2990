export enum GameMode {
  twoD = 0,
  threeD = 1,
}

export interface ICard {
    gameID: number;
    gamemode: GameMode;
    title: string;
    subtitle: string;
    avatarImageUrl: string;
    gameImageUrl: string;
  }
