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

export interface IPosition2D {
    x: number;
    y: number;
}

export interface IColorRGB {
    R: number;
    G: number;
    B: number;
}

export interface IOriginalImageSegment {
    startPosition: IPosition2D;
    width:      number;
    height:     number;
    image:      Buffer;
}

export interface IPlayerInputReponse {
    status:         string;
    response:       IOriginalImageSegment | string;
}

export interface IPlayerInput {
    event:      string;
    arenaId:    number;
    username:   string;
    position:   IPosition2D;
}
