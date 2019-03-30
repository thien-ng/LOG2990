import { CCommon } from "../../../common/constantes/cCommon";

// Constantes pour le serveur Angular
export class CClient {

  public static readonly LOGIN_PATH:                string = "login";
  public static readonly LOGIN_REDIRECT:            string = "/" + CClient.LOGIN_PATH;
  public static readonly ADMIN_PATH:                string = "admin";
  public static readonly ADMIN_REDIRECT:            string = "/" + CClient.ADMIN_PATH;
  public static readonly GAME_VIEW_SIMPLE:          string = "game-view-simple/:id/:gamemode";
  public static readonly GAME_VIEW_FREE:            string = "game-view-free/:id/:gamemode";
  public static readonly ROOT_PATH:                 string = "";
  public static readonly NAV_PATH:                  string = "";
  public static readonly GAMELIST_PATH:             string = "gamelist";
  public static readonly GAMELIST_REDIRECT:         string = "/" + CClient.GAMELIST_PATH;
  public static readonly PATH_MATCH_FULL:           string = "full";
  public static readonly PATH_TO_ICONS:             string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/icon";
  public static readonly PATH_TO_IMAGES:            string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/image";
  public static readonly PATH_TO_PROFILE_IMAGES:    string = CClient.PATH_TO_IMAGES + "/userPicture/";
  public static readonly PATH_TO_MESHES:            string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/mesh";
  public static readonly PATH_TO_GET_CARD:          string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/card/";

  public static readonly OBLIGATORY_CATCH:          string = "obligatory catch";
  public static readonly ANIMATION_TIME:            number = 300; // ms

  public static readonly WEBSOCKET_URL:             string = CCommon.BASE_URL + ":3333";
  public static readonly PATH_TO_LOGIN_VALIDATION:  string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/user/newUsername";
  public static readonly LOGIN_MESSAGE_TITLE:       string = "onUserSubscribe";
  public static readonly NAME_VALID_VALUE:          string = "true";
  public static readonly ROUTER_LOGIN:              string = "gamelist";
  public static readonly SNACKBAR_USED_NAME:        string = " est déjà pris par un autre utilisateur!";
  public static readonly SNACKBAR_ATTENTION:        string = "J'ai compris";
  public static readonly SNACKBAR_GREETINGS:        string = "Bonjour ";
  public static readonly SNACKBAR_ACKNOWLEDGE:      string = "Merci!";
  public static readonly USERNAME_KEY:              string = "userName";
  public static readonly SNACKBAR_DURATION:         number = 5000;

  // constant for create-simple-game.component.ts
  public static readonly SNACK_ERROR_MSG:           string = "Veuillez entrer un fichier BMP";
  public static readonly SNACK_ACTION:              string = "OK";
  public static readonly SNACK_POS_TOP:             string = "top";
  public static readonly NAME_KEY:                  string = "name";
  public static readonly ORIGINAL_IMAGE_KEY:        string = "originalImage";
  public static readonly MODIFIED_IMAGE_KEY:        string = "modifiedImage";

  // constants for game list container
  public static readonly CARDS_PATH:                string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/card/list";
  public static readonly REMOVE_CARD_PATH:          string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/card/remove";
  public static readonly HIGHSCORE_PATH:            string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/highscore/";
  public static readonly RESET_PATH:                string = "generator/";

  // Constants for socket.service.ts
  public static readonly ON_CONNECT:                string = "connect";
  public static readonly ON_ARENA_RESPONSE:         string = "onArenaResponse";
  public static readonly ON_GAME_FREE_DATA:         string = "onGameFreeData";
  public static readonly ON_USER_EVENT:             string = "onNewUser";
  public static readonly ON_POINT_ADDED:            string = "onPointAdded";
  public static readonly ON_RETRIEVE_USER:          string = "onRetrieveUser";
  public static readonly ON_TIMER_UPDATE:           string = "onTimerUpdate";

  // Constants for game-view-simple.service.ts
  public static readonly DECIMAL_BASE:              number = 10;
  public static readonly ID_BY_URL:                 string = "id";
  public static readonly ERROR_MESSAGE:             string = "⚠ ERREUR ⚠";
  public static readonly CENTERY:                   number = 15;
  public static readonly CENTERX:                   number = 50;

  // Constants for game view free component
  public static readonly DEFAULT_SLIDER_VALUE:      number = 100;
  public static readonly GAME_REQUEST_PATH:         string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/game/request";
  public static readonly CANCEL_REQUEST_PATH:       string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/game/cancel-request/";
  public static readonly SUCCESS_STATUS:            number = 200;

  // Constants for card.component.ts
  public static readonly GAME_VIEW_FREE_PATH:       string = "/game-view-free";
  public static readonly GAME_VIEW_SIMPLE_PATH:     string = "/game-view-simple";
  public static readonly GAMEMODE_SIMPLE:           string = "simple";

  // Constants for difference-counter.service.ts
  public static readonly DEGREE_CIRCLE:             number = 360;
  public static readonly PERCENT:                   number = 100;

  // Constants for timer.service
  public static readonly SECONDS_IN_MINUTE:         number = 60;

  // Constants for create simple game
  public static readonly SIMPLE_SUBMIT_PATH:        string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/card/submitSimple";

  // Constants for create free game
  public static readonly FREE_SUBMIT_PATH:          string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/card/submitFree";
  public static readonly FREE_SCENE_GENERATOR_PATH: string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/scene/generator";

  // Constants for three js
  public static readonly FIELD_OF_VIEW:             number = 40;
  public static readonly MAX_VIEW_DISTANCE:         number = 1000;
  public static readonly MIN_VIEW_DISTANCE:         number = 0.1;

  public static readonly AMBIENT_LIGHT_COLOR:       string = "#FFFFFF";
  public static readonly AMBIENT_LIGHT_INTENSITY:   number = 0.4;

  public static readonly SCENE_WIDTH:               number = 640;
  public static readonly SCENE_HEIGHT:              number = 480;

  public static readonly FIRST_LIGHT_COLOR:         string = "#FFFFFF";
  public static readonly FIRST_LIGHT_INTENSITY:     number = 1;
  public static readonly FIRST_LIGHT_POSITION_X:    number = 100;
  public static readonly FIRST_LIGHT_POSITION_Y:    number = 100;
  public static readonly FIRST_LIGHT_POSITION_Z:    number = 50;
  public static readonly SECOND_LIGHT_COLOR:        string = "#FFFFFF";
  public static readonly SECOND_LIGHT_INTENSITY:    number = 0.2;
  public static readonly SECOND_LIGHT_POSITION_X:   number = -10;
  public static readonly SECOND_LIGHT_POSITION_Y:   number = -10;
  public static readonly SECOND_LIGHT_POSITION_Z:   number = -10;

  public static readonly SPEED_FACTOR:              number = 0.001;
  public static readonly POSITION_FACTOR:           number = 100;

  public static readonly CAMERA_LOOK_AT_X:          number = 50;
  public static readonly CAMERA_LOOK_AT_Y:          number = 50;
  public static readonly CAMERA_LOOK_AT_Z:          number = 50;
  public static readonly CAMERA_POSITION_X:         number = 0;
  public static readonly CAMERA_POSITION_Y:         number = 70;
  public static readonly CAMERA_POSITION_Z:         number = 0;
  public static readonly FLOOR_DIMENTION:           number = 2000;
  public static readonly FLOOR_SEGMENT:             number = 8;
  public static readonly FLOOR_COLOR:               number = 0x567D46;
  public static readonly FLOOR_DIVIDER:             number = 2;
  public static readonly FOG_COLOR:                 number = 0x444444;
  public static readonly FOG_NEAR_DISTANCE:         number = 300;
  public static readonly FOG_FAR_DISTANCE:          number = 500;

  public static readonly GET_OBJECTS_ID_PATH:       string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/game/";

  // Constants for chat view
  public static readonly ON_FAILED_CLICK:           string = "onFailedClick";
  public static readonly FAILED_CLICK_MESSAGE:      string = "Wrong Hit";
  public static readonly GOOD_CLICK_MESSAGE:        string = "Good Hit";
  public static readonly ACTIVE_LOBBY_PATH:         string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/game/active-lobby";
  public static readonly CARD_DELETED_MESSAGE:      string = "Le jeu pour lequel vous étiez en attente a été supprimé";
}
