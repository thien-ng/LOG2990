export class Constants {
  public static readonly LOGIN_REDIRECT: string = "/login";
  public static readonly LOGIN_PATH: string = "login";
  public static readonly ADMIN_PATH: string = "admin";
  public static readonly ADMIN_REDIRECT: string = "/admin";
  public static readonly ROOT_PATH: string = "";
  public static readonly NAV_PATH: string = "";
  public static readonly GAMELIST_PATH: string = "gamelist";
  public static readonly GAMELIST_REDIRECT: string = "//gamelist";
  public static readonly PATH_MATCH_FULL: string = "full";
  public static readonly PATH_TO_ASSETS: string = "http://localhost:3000/api/asset";
  public static readonly PATH_TO_ICONS: string = "http://localhost:3000/api/asset/icon";
  public static readonly PATH_TO_IMAGES: string = "http://localhost:3000/api/asset/image";

  public static readonly OBLIGATORY_CATCH: string = "obligatory catch";
  public static readonly ANIMATION_TIME: number = 300; // ms
  public static readonly MIN_GAME_LENGTH: number = 5;
  public static readonly MAX_GAME_LENGTH: number = 20;

  // Constant for login-validator.service.ts
  public static readonly MIN_LENGTH: number = 4;
  public static readonly MAX_LENGTH: number = 15;
  public static readonly REGEX_PATTERN: string = "^[a-zA-Z0-9]+$";
  public static readonly LOGIN_REQUEST: string = "onLogin";
  public static readonly LOGIN_RESPONSE: string = "onLoginReponse";
  public static readonly WEBSOCKET_URL: string = "http://localhost:3333";
  public static readonly NAME_VALID_VALUE: string = "true";
  public static readonly ROUTER_LOGIN: string = "gamelist";
  public static readonly SNACKBAR_USED_NAME: string = "Cet alias est déjà pris par un autre utilisateur!";
  public static readonly SNACKBAR_ATTENTION: string = "J'ai compris";
  public static readonly SNACKBAR_DURATION: number = 5000;

  // Constant for basic.service.ts
  public static readonly BASIC_SERVICE_BASE_URL: string = "http://localhost:3000";

  // constant for create-simple-game.component.ts
  public static readonly GAME_REGEX_PATTERN: string = "^[a-z A-Z]+$";
  public static readonly SNACK_ERROR_MSG: string = "Veuillez entrer un fichier BMP";
  public static readonly SNACK_ACTION: string = "OK";
  public static readonly SNACK_POS_TOP: string = "top";

  // constants for game list container
  public static readonly CARDS_PATH: string = "/api/card/list";
  public static readonly REMOVE_CARD_PATH: string = "/api/card/remove";

  public static readonly HIGHSCORE_PATH: string = "/api/highscore";

}
