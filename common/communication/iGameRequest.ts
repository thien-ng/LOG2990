import { GameMode } from "./iCard";

export interface IGameRequest {
    username: string;
    gameId: number;
    type: GameType;
    mode: GameMode;
}

export enum GameType {
    singlePlayer,
    multiPlayer,
}