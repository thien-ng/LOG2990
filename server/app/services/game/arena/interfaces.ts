import { IPosition2D } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";

export interface IHitToValidate {
    position:           IPosition2D;
    imageUrl:           string;
    colorToIgnore:      number[];
}

export interface IArenaInfos {
    arenaId:            number;
    users:              IUser[];
    originalGameUrl:    string;
    differenceGameUrl:  string;
}

export interface IHitConfirmation {
    isAHit:             Boolean;
    hitPixelColor:      number[];
}

export interface IPlayerInput {
    event:              string;
    arenaId:            number;
    user:               IUser;
    position:           IPosition2D;
}
