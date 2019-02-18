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

export interface IPosition2D {
    x: number;
    y: number;
}

export interface IOriginalPixelsFound {
    position: IPosition2D;
    color:  number[];
}

export interface IOriginalImageSegment {
    startPosition: IPosition2D;
    width:      number;
    height:     number;
    image:      Buffer;
}
