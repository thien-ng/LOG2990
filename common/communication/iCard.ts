export enum GameMode {
  simple = "simple",
  free = "free",
}

export interface ICard {
    gameID: number;
    gamemode: GameMode;
    title: string;
    subtitle: string;
    avatarImageUrl: string;
    gameImageUrl: string;
  }
