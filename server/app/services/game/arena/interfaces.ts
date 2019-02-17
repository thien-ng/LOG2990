import { User } from "../../../../../common/communication/iUser";

export interface IHitToValidate {
    posX:               number;
    posY:               number;
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
