export interface IPosition2D {
    x:  number;
    y:  number;
}

export interface IColorRGB {
    R:  number;
    G:  number;
    B:  number;
}

export interface IClickMessage {
    position:       IPosition2D;
    arenaID:        number;
    username:       string;
}

export interface IReplacementPixel {
    color:          IColorRGB;
    position:       IPosition2D;
}

export interface IOriginalPixelCluster {
    differenceKey:  number;
    cluster:        IReplacementPixel[];
}

export interface IOriginalImageSegment {
    startPosition: IPosition2D;
    width:      number;
    height:     number;
    image:      number[];
}

export interface IPlayerInputResponse {
    status:         string;
    response:       IOriginalPixelCluster;
}