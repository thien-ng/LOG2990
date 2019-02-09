export class Constants {

  // Constants for websocket.ts
  public static readonly SOCKET_IO: string = "socket.io";
  public static readonly LOGIN_EVENT: string = "onLogin";
  public static readonly CONNECTION: string = "connection";
  public static readonly DISCONNECT_EVENT: string = "disconnect";
  public static readonly POSITION_VALIDATION_EVENT: string = "onPositionValidation";
  public static readonly WEBSOCKET_PORT_NUMBER: number = 3333;

  // Constants for buffermanager.ts
  public static readonly BUFFER_FORMAT: string = "hex";
  public static readonly WHITE_PIXEL: string = "ffffff";
  public static readonly BLACK_PIXEL: string = "000000";
  public static readonly BUFFER_TYPE: string = "Buffer";

  // Constants for difference-checker.service.ts
  public static readonly ERROR_IMAGES_DIMENSIONS: string = "Les images n'ont pas les dimensions attendues (640x480)";
  public static readonly ERROR_MISSING_DIFFERENCES: string = "Les images ne contiennent pas 7 differences";
  public static readonly CIRCLE_RADIUS: number = 3;
  public static readonly REQUIRED_WIDTH: string = "80020000";
  public static readonly REQUIRED_HEIGTH: string = "e0010000";
  public static readonly BUFFER_START_DIMENSION: number = 18;
  public static readonly BUFFER_MIDDLE_DIMENSION: number = 22;
  public static readonly BUFFER_END_DIMENSION: number = 26;

  // Constants for imagesDifference.ts
  public static readonly ERROR_UNEQUAL_DIMENSIONS: string = "Taille des images ne sont pas pareilles";

  // Constants for card-manager.service.ts

  public static readonly ORIGINAL_FILE: string = "_original.bmp";
  public static readonly MODIFIED_FILE: string = "_modified.bmp";
  public static readonly GENERATED_FILE: string = "_generated.bmp";
  public static readonly BASIC_SERVICE_BASE_URL: string = "http://localhost:3000";
  public static readonly ON_ERROR_MESSAGE: string = "onError";
  public static readonly ON_SUCCESS_MESSAGE: string = "onSuccess";
  public static readonly VALIDATION_FAILED: string = "Validation services failed";
}
