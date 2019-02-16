export class SceneConstants {

    // Colors
    public static readonly HEX_TYPE: number = 16;
    public static readonly HEX_PREFIX: string = "#";
    public static readonly MIN_COLOR_GRADIENT: number = 0;
    public static readonly MAX_COLOR_GRADIENT: number = 255;
    // Positions
    public static readonly MAX_POSITION_X: number = 1000;
    public static readonly MAX_POSITION_Y: number = 1000;
    public static readonly MAX_POSITION_Z: number = 1000;
    // Scales
    public static readonly MIN_SCALE: number = 5;
    public static readonly MAX_SCALE: number = 15;
    // Rotation
    /* tslint:disable:no-magic-numbers */
    public static readonly TWO_PI: number = Math.PI * 2;
    // Math
    public static readonly TWO: number = 2;
    public static readonly THREE: number = 3;

    // Constants for scene-manager.service.ts
    public static readonly TYPE_CUBE: string = "cube";
    public static readonly TYPE_CONE: string = "cone";
    public static readonly TYPE_CYLINDER: string = "cylinder";
    public static readonly TYPE_PYRAMID: string = "pyramid";
}
