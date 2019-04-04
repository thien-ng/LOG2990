import { CServer } from "../../server/app/CServer";

export enum GameMode {
  simple  = "simple",
  free    = "free",
  invalid = "invalid",
}

export interface Dialog {
  message:    string;
  gameTitle:  string;
}

export enum CardDeleted {
  true,
  false,
}

export enum MultiplayerButtonText {
  create = "CRÉER",
  join   = "JOINDRE",
}

export interface ICard {
    gameID:           number;
    gamemode:         GameMode;
    title:            string;
    subtitle:         string;
    avatarImageUrl:   string;
    gameImageUrl:     string;
    lobbyExists?:     boolean;
  }
  
export interface ILobbyEvent {
  gameID:       number;
  buttonText:   MultiplayerButtonText;
}

export const DefaultCard2D: ICard = {
  gameID:             1,
  gamemode:           GameMode.simple,
  title:              "Stewie deathray",
  subtitle:           "Default Image",
  avatarImageUrl:     CServer.PATH_TO_IMAGES + "default.gif",
  gameImageUrl:       CServer.PATH_TO_IMAGES + "default.gif",
}

export const DefaultCard3D: ICard = {
  gameID:             2,
  gamemode:           GameMode.free,
  title:              "Scène par défaut",
  subtitle:           "Scène par défaut",
  avatarImageUrl:     CServer.PATH_TO_IMAGES + "2_snapshot.jpeg",
  gameImageUrl:       CServer.PATH_TO_IMAGES + "2_snapshot.jpeg",
}
