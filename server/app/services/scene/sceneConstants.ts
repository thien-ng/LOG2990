export class SceneConstants {

    // Scene object types
    public static readonly MAX_TYPE_INDEX: number = 4;
    // Colors
    public static readonly HEX_TYPE: number = 16;
    public static readonly HEX_PREFIX: string = "#";
    public static readonly MIN_COLOR_GRADIENT: number = 0;
    public static readonly MAX_COLOR_GRADIENT: number = 255;
    // Positions
    public static readonly MAX_POSITION_X: number = 100;
    public static readonly MAX_POSITION_Y: number = 100;
    public static readonly MAX_POSITION_Z: number = 100;
    // Scales
    public static readonly MIN_SCALE: number = 2;
    public static readonly MAX_SCALE: number = 8;
    // Rotation
    /* tslint:disable:no-magic-numbers */
    public static readonly TWO_PI: number = Math.PI * 2;
    // Math
    public static readonly TWO: number = 2;
    public static readonly THREE: number = 3;

    // Constants for scene-manager.service.ts
    public static readonly TYPE_GEOMETRIC: string = "Geometric";
    public static readonly TYPE_THEMATIC: string = "Thematic";

    // Constants for scene-modifier.ts
    public static readonly OPTION_ADD: string = "add";
    public static readonly OPTION_REMOVE: string = "remove";
    public static readonly OPTION_CHANGE_COLOR: string = "changeColor";

}
