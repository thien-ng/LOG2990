import { ICard, GameMode } from "./iCard";

export interface ICardLists {
  list2D: ICard[],
  list3D: ICard[],
}

export interface ICardsIds {
  descriptions: ICardDescription[];
  index2D:      number;
  index3D:      number;
}

export interface ICardDescription {
  id:       number;
  title:    string;
  gamemode: GameMode;
}
