export class Constants {

  public static readonly PATH_FROM_CONTROLLER_TO_ASSET: string = "../../../../app/asset";

  // Constants for websocket.ts
  public static readonly SOCKET_IO: string = "socket.io";
  public static readonly LOGIN_EVENT: string = "onLogin";
  public static readonly CONNECTION: string = "connection";
  public static readonly DISCONNECT_EVENT: string = "disconnect";
  public static readonly WEBSOCKET_PORT_NUMBER: number = 3333;

  //Constants for buffermanager.ts
  public static readonly BUFFER_FORMAT: string = "hex";
  public static readonly WHITE_PIXEL: string = "ffffff";
  public static readonly BLACK_PIXEL: string = "000000";
  public static readonly BUFFER_TYPE: string = "Buffer";
}
