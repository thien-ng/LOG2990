import { IUser } from "../../../../../common/communication/iUser";

export interface IArenaInfos {
    arenaId:            number;
    users:              IUser[];
    originalGameUrl:    string;
    differenceGameUrl:  string;
}

export interface IPlayerInput<EVT_T> {
    event:              string;
    arenaId:            number;
    user:               IUser;
    eventInfo:          EVT_T;
}

export interface IHitToValidate<EVT_T> {
    eventInfo:          EVT_T;
    differenceDataURL:  string;
    colorToIgnore?:     number;
}

export interface IHitConfirmation {
    isAHit:             Boolean;
    differenceIndex:    number;
}
