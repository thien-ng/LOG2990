export class Constants {
    // Constants for
    public static readonly BMP_HEADER_SIZE:      number = 54;  // a mettre dans les constantes
    public static readonly IS_A_DIFFERENCE:      number =  0;   // a mettre dans les constantes
    public static readonly PIXEL_24B_SIZE:       number = 3;   // a mettre dans les constantes
    public static readonly BASE_BMP_HEADER_SIZE: number =   14;
    public static readonly BMP_INFOHEADER_SIZE:  number =   40;
    public static readonly WIDTH_OFFSET:         number = 18;    // a bouger dans les constantes ?
    public static readonly HEIGHT_OFFSET:        number = 22;    // a bouger dans les constantes ?
    public static readonly VALUE_EQUAL:          number = 255;

    // Constants for differenceFinder.ts
    public static readonly ERROR_UNEQUAL_DIMENSIONS: string = "Taille des images ne sont pas pareilles";

    // Constants for difference-checker.service.ts
    public static readonly ERROR_IMAGES_DIMENSIONS:     string = "Les images n'ont pas les dimensions attendues (640x480)";
    public static readonly ERROR_MISSING_DIFFERENCES:   string = "Les images ne contiennent pas 7 differences";
    public static readonly ON_ERROR_MESSAGE:            string = "onError";
    public static readonly UNKNOWN_ERROR:               string = "Erreur inconnue";
    public static readonly CIRCLE_RADIUS:               number = 3;
    public static readonly REQUIRED_WIDTH:              string = "80020000";
    public static readonly REQUIRED_HEIGTH:             string = "e0010000";
    public static readonly BUFFER_FORMAT:               string = "hex";

    public static readonly BUFFER_START_DIMENSION:      number = 18;
    public static readonly BUFFER_MIDDLE_DIMENSION:     number = 22;
    public static readonly BUFFER_END_DIMENSION:        number = 26;
}
