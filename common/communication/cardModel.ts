import { Highscore } from "./highscore";

export interface CardModel {
    gameID: number;
    title: string;
    subtitle: string;
    avatarImageUrl: string;
    gameImageUrl: string;
    highscore: Highscore;
  }