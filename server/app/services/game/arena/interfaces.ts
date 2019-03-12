import { IUser } from "../../../../../common/communication/iUser";
// tslint:disable:no-any

export interface IArenaInfos {
    arenaId:            number;
    users:              IUser[];
    originalGameUrl:    string;
    differenceGameUrl:  string;
}

export interface IPlayerInput {
    event:              string;
    arenaId:            number;
    user:               IUser;
    eventInfo:          any;
}

export interface IHitToValidate {
    eventInfo:          any;
    differenceDataURL:  string;
    colorToIgnore?:     number;
}

export interface IHitConfirmation {
    isAHit:             Boolean;
    differenceIndex:    number;
}
