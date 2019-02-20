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


export interface IReplacementPixel {
    color:      IColorRGB;
    position:   IPosition2D;
}

export interface IOriginalPixelCluster {
    differenceKey:  number;
    cluster:        IReplacementPixel[];
}

export interface IPlayerInputResponse {
    status:         string;
    response:       IOriginalPixelCluster;
}

export interface IPlayerInput {
    event:      string;
    arenaId:    number;
    user:       User;
    position:   IPosition2D;
}
