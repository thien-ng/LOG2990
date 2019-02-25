import { IOriginalPixelCluster } from "../../common/communication/iGameplay";

export class Constants {

  // Constants for websocket.ts
  public static readonly SOCKET_IO:                 string = "socket.io";
  public static readonly LOGIN_EVENT:               string = "onLogin";
  public static readonly CONNECTION:                string = "connection";
  public static readonly DISCONNECT_EVENT:          string = "disconnect";
  public static readonly POSITION_VALIDATION_EVENT: string = "onPositionValidation";
  public static readonly CHAT_MESSAGE:              string = "onChatMessage";
  public static readonly GAME_CONNECTION:           string = "onGameConnection";
  public static readonly GAME_DISCONNECT:           string = "onGameDisconnect";
  public static readonly USER_EVENT:                string = "onNewUser";
  public static readonly WEBSOCKET_PORT_NUMBER:     number = 3333;
  public static readonly ON_RETRIEVE_USER:          string = "onRetrieveUser";
  public static readonly CLICK_EVENT:               string = "onClick";
  public static readonly ON_ARENA_RESPONSE:         string = "onArenaResponse";
  public static readonly ON_TIMER_UPDATE:           string = "onTimerUpdate";
  public static readonly ON_POINT_ADDED:            string = "onPointAdded";

  // Constants for card-manager.service.ts
  public static readonly SCENE_SNAPSHOT:            string = "_snapshot.jpeg";
  public static readonly ORIGINAL_FILE:             string = "_original.bmp";
  public static readonly MODIFIED_FILE:             string = "_modified.bmp";
  public static readonly GENERATED_FILE:            string = "_generated.bmp";
  public static readonly BASE_URL:                  string = "http://localhost:3000";
  public static readonly PATH_FOR_2D_VALIDATION:    string = Constants.BASE_URL + "/api/differenceChecker";
  public static readonly ON_ERROR_MESSAGE:          string = "onError";
  public static readonly ON_SUCCESS_MESSAGE:        string = "onSuccess";
  public static readonly VALIDATION_FAILED:         string = "Validation services failed";
  public static readonly UNKNOWN_ERROR:             string = "Erreur inconnue";
  public static readonly GENERATED_SNAPSHOT:        string = "_snapshot.jpeg";
  public static readonly SCENES_FILE:               string = "_scene";
  public static readonly ORIGINAL_SCENE_FILE:       string = "_sceneOriginal.txt";
  public static readonly MODIFIED_SCENE_FILE:       string = "_sceneModified.txt";
  public static readonly DECIMAL:                   number = 10;
  public static readonly DOESNT_EXIST:              number = -1;
  public static readonly CARD_DELETED:              string = "Carte supprimée";
  public static readonly CARD_ADDED:                string = "Carte ajoutée";
  public static readonly IMAGES_PATH:               string = "./app/asset/image";
  public static readonly SCENE_PATH:                string = "./app/asset/scene";
  public static readonly CARD_NOT_FOUND:            string = "Erreur de suppression, carte pas trouvée";
  public static readonly REQUIRED_HEIGHT:           number = 480;
  public static readonly REQUIRED_WIDTH:            number = 640;
  public static readonly REQUIRED_NB_DIFF:          number = 7;
  public static readonly START_ID_2D:               number = 1000;
  public static readonly START_ID_3D:               number = 2000;

  public static readonly CARD_EXISTING:             string = "Le titre de la carte existe déjà";

  // Constants for card-manager-controller
  public static readonly DEFAULT_CARD_ID:           number = 1;
  public static readonly DELETION_ERROR_MESSAGE:    string = "Impossible de supprimer la carte par défault";

  // Constants for game manager
  public static readonly PATH_TO_IMAGES:            string = Constants.BASE_URL + "/image/";
  public static readonly UNIQUE_NAME:               string = "true";
  public static readonly NOT_UNIQUE_NAME:           string = "false";

  // Constants for user manager service
  public static readonly USER_NOT_FOUND:            string = "Utilisateur inexistant";
  public static readonly NAME_FORMAT_LENTGH_ERROR: string = "Le nom doit contenir entre 4 et 15 characteres";
  public static readonly NAME_FORMAT_REGEX_ERROR: string = "Le nom doit contenir seulement des caracteres alphanumerics";
  public static readonly SUCCESS_TITLE: string = "onSuccess";
  public static readonly ERROR_TITLE: string = "onError";
  public static readonly REGEX_FORMAT: string = "^[a-zA-Z0-9_]*$";
  public static readonly MAX_VALUE: number = 15;
  public static readonly MIN_VALUE: number = 4;

  // Constants for arena.ts
  public static readonly FF:                        number = 255;
  public static readonly WHITE:                     number[] = [Constants.FF, Constants.FF, Constants.FF];
  public static readonly URL_HIT_VALIDATOR:         string = "http://localhost:3000/api/hitvalidator";
  public static readonly ONE_SECOND:                number = 1000;
  public static readonly ON_ERROR_PIXEL_CLUSTER:    IOriginalPixelCluster = { differenceKey: -1, cluster: [] };
}
