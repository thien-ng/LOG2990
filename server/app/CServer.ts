import { CCommon } from "../../common/constantes/cCommon";

// Constantes pour le serveur Express
export class CServer {

  // CServer for websocket.ts
  public static readonly SOCKET_IO:                 string = "socket.io";
  public static readonly CONNECTION:                string = "connection";
  public static readonly DISCONNECT_EVENT:          string = "disconnect";
  public static readonly WEBSOCKET_PORT_NUMBER:     number = 3333;
  public static readonly CLICK_EVENT:               string = "onClick";
  public static readonly ON_ARENA_RESPONSE:         string = "onArenaResponse";
  public static readonly ON_PENALTY:                string = "onPenalty";
  public static readonly ON_TIMER_UPDATE:           string = "onTimerUpdate";
  public static readonly ON_POINT_ADDED:            string = "onPointAdded";
  public static readonly ON_CHAT_EVENT:             string = "onChatEvent";

  // CServer for card-manager.service.ts
  public static readonly SCENE_SNAPSHOT:            string = "_snapshot.jpeg";
  public static readonly GENERATED_FILE:            string = "_generated.bmp";
  public static readonly PATH_FOR_2D_VALIDATION:    string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/differenceChecker";
  public static readonly VALIDATION_FAILED:         string = "Validation services failed";
  public static readonly UNKNOWN_ERROR:             string = "Erreur inconnue";
  public static readonly GENERATED_SNAPSHOT:        string = "_snapshot.jpeg";
  public static readonly ORIGINAL_SCENE_FILE:       string = "_sceneOriginal.txt";
  public static readonly MODIFIED_SCENE_FILE:       string = "_sceneModified.txt";
  public static readonly SIMPLE_CARD_FILE:          string = "_simple_card.json";
  public static readonly FREE_CARD_FILE:            string = "_free_card.json";
  public static readonly HIGHSCORE_FILE:            string = "_highscore.json";
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
  public static readonly CARD_CREATION_ERROR:       string = "Les données entrées sont invalides";
  public static readonly GAME_NAME_ERROR:           string = "Le titre du jeu doit contenir seulement des caracteres alphanumeriques";
  public static readonly GAME_FORMAT_LENTGH_ERROR:  string = "Le titre du jeu doit contenir entre " + CCommon.MIN_GAME_LENGTH +
                                                             " et " + CCommon.MAX_GAME_LENGTH + " caracteres";
  public static readonly GAME_TITLE_IS_CORRECT:     string = "Le titre est correct";

  // CServer for card-manager-controller
  public static readonly DEFAULT_CARD_2D:           number = 1;
  public static readonly DEFAULT_CARD_3D:           number = 2;
  public static readonly DELETION_ERROR_MESSAGE:    string = "Impossible de supprimer la carte par défault";

  // CServer for game manager
  public static readonly PATH_TO_IMAGES:            string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/image/";
  public static readonly PATH_TO_SCENES:            string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/scene/";
  public static readonly PATH_TO_MESHES:            string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/mesh/";

  public static readonly PATH_SERVER_TEMP:          string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/temp/";
  public static readonly PATH_LOCAL_TEMP:           string = "./app/asset/temp/";
  public static readonly PATH_LOCAL_THEME:          string = "./app/asset/theme/";
  public static readonly PATH_LOCAL_CARDS:          string = "./app/asset/cards/";
  public static readonly PATH_LOCAL_CARDS_IDS:      string = "./app/asset/cards/cardsIds.json";
  public static readonly PATH_LOCAL_HIGHSCORE:      string = "./app/asset/cards/highscore/";
  public static readonly NOT_UNIQUE_NAME:           string = "isNotUnique";
  public static readonly INIT_ARENA_ERROR:          string = "Erreur lors de l'initialisation de l'arène 2D";

  // CServer for user manager service
  public static readonly USER_NOT_FOUND:            string = "Utilisateur inexistant";
  public static readonly NAME_FORMAT_LENGTH_ERROR:  string = "Le nom doit contenir entre 4 et 15 characteres";
  public static readonly USER_NAME_ERROR:           string = "Le nom doit contenir seulement des caracteres alphanumériques";

  // CServer for arena.ts
  public static readonly FF:                        number = 255;
  public static readonly URL_HIT_VALIDATOR:         string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/hitvalidator";
  public static readonly ONE_SECOND:                number = 1000;

  // CServer for scene manager service
  public static readonly MIN_ITEMS_IN_SCENE:        number = 10;
  public static readonly MAX_ITEMS_IN_SCENE:        number = 200;
  public static readonly THEME_GEOMETRIC:           string = "geometric";
  public static readonly THEME_THEMATIC:            string = "thematic";

  // CServer for highscore.service.ts
  public static readonly VALIDATE_HIGHSCORE_PATH:   string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/highscore-api";

  // Cserver for profilePictureGenerator.ts
  public static readonly PROFILE_PIC_GEN_PATH:      string = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/api/profile-picture";
  public static readonly PROFILE_IMAGE_PATH:        string = CServer.IMAGES_PATH + "/userPicture/";
}
