import { IPosition2D } from "../../../../../common/communication/iGameplay";
import { User } from "../../../../../common/communication/iUser";

export interface IHitToValidate {
    position:      IPosition2D;
    imageUrl:           string;
    colorToIgnore:    number[];
}

export interface IArenaInfos {
    arenaId:            number;
    users:              User[];
    originalGameUrl:    string;
    differenceGameUrl:  string;
}

export interface IHitConfirmation {
    isAHit:         Boolean;
    hitPixelColor: number[];
}

export interface IPlayerInput {
    event:      string;
    arenaId:    number;
    user:       User;
    position:   IPosition2D;
}
