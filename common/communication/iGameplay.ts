export interface ICanvasPosition {
    positionX: number;
    positionY: number;
}

export interface IClickMessage {
    position: ICanvasPosition;
    arenaID: number;
    username: string;
}

export interface IPosition2D {
    x: number;
    y: number;
}

export interface IOriginalImageSegment {
    startPosition: IPosition2D;
    width:      number;
    height:     number;
    image:      number[];
}

export interface IPlayerInputReponse {
    status:         string;
    response:       IOriginalImageSegment | string;
}