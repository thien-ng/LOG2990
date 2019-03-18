import { GameMode } from "./iCard";
import { Mode } from "./highscore";

export interface IGameRequest {
    username:   string;
    gameId:     number;
    type:       Mode;
    mode:       GameMode;
}

