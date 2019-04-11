import { IColorRGB } from "./iGameplay";

export interface IUser {
    username:   string;
    socketID:   string;
}

export interface IProfileRequest {
    username: string;
    color?:   IColorRGB;
}