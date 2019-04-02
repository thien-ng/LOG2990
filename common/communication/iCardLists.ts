import { ICard, GameMode } from "./iCard";

export interface ICardLists {
  list2D: ICard[],
  list3D: ICard[],
}

export interface ICardsIds {
  descriptions: ICardDescription[];
}

export interface ICardDescription {
  id:       number;
  title:    string;
  gamemode: GameMode;
}
