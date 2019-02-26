export enum GameMode {
  simple =  "simple",
  free =    "free",
  invalid = "invalid",
}

export interface ICard {
    gameID:           number;
    gamemode:         GameMode;
    title:            string;
    subtitle:         string;
    avatarImageUrl:   string;
    gameImageUrl:     string;
  }

export const DefaultCard2D: ICard = {
  gameID: 1,
  gamemode: GameMode.simple,
  title: "Stewie deathray",
  subtitle: "Default Image",
  avatarImageUrl: "http://localhost:3000/image/default.gif",
  gameImageUrl: "http://localhost:3000/image/default.gif",
}

export const DefaultCard3D: ICard = {
  gameID: 1,
  gamemode: GameMode.free,
  title: "Scène par défaut",
  subtitle: "Scène par défaut",
  avatarImageUrl: "http://localhost:3000/image/1_snapshot.jpeg",
  gameImageUrl: "http://localhost:3000/image/1_snapshot.jpeg",
}