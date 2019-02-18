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

  // Constants for card-manager.service.ts
  public static readonly SCENE_SNAPSHOT:            string = "_snapshot.jpeg";
  public static readonly ORIGINAL_FILE:             string = "_original.bmp";
  public static readonly MODIFIED_FILE:             string = "_modified.bmp";
  public static readonly GENERATED_FILE:            string = "_generated.bmp";
  public static readonly BASE_URL:                  string = "http://localhost:3000";
  public static readonly PATH_FOR_2D_VALIDATION:    string = Constants.BASE_URL + "/api/differenceChecker/validate";
  public static readonly ON_ERROR_MESSAGE:          string = "onError";
  public static readonly ON_SUCCESS_MESSAGE:        string = "onSuccess";
  public static readonly VALIDATION_FAILED:         string = "Validation services failed";
  public static readonly UNKNOWN_ERROR:             string = "Erreur inconnue";
  public static readonly GENERATED_SNAPSHOT:        string = "_snapshot.jpeg";
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

  public static readonly CARD_EXISTING: string = "Le ID ou le titre de la carte existe déja";

  // Constants for card-manager-controller
  public static readonly DEFAULT_CARD_ID:           number = 1;
  public static readonly DELETION_ERROR_MESSAGE:    string = "Impossible de supprimer la carte par défault";
}
