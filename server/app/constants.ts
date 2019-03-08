import { IOriginalPixelCluster } from "../../common/communication/iGameplay";
import { CCommon } from "../../common/constantes/cCommon";

export class Constants {

  // Constants for websocket.ts
  public static readonly SOCKET_IO:                 string = "socket.io";
  public static readonly CONNECTION:                string = "connection";
  public static readonly DISCONNECT_EVENT:          string = "disconnect";
  public static readonly POSITION_VALIDATION_EVENT: string = "onPositionValidation";
  public static readonly WEBSOCKET_PORT_NUMBER:     number = 3333;
  public static readonly CLICK_EVENT:               string = "onClick";

  // Constants for card-manager.service.ts
  public static readonly SCENE_SNAPSHOT:            string = "_snapshot.jpeg";
  public static readonly GENERATED_FILE:            string = "_generated.bmp";
  public static readonly PATH_FOR_2D_VALIDATION:    string = CCommon.BASE_URL + "/api/differenceChecker";
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
  public static readonly CARD_CREATION_ERROR:       string = "Les données entrées sont invalides";
  public static readonly GAME_NAME_ERROR:   string = "Le titre du jeu doit contenir seulement des caracteres alphanumeriques";
  public static readonly GAME_FORMAT_LENTGH_ERROR:  string = "Le titre du jeu doit contenir entre" + CCommon.MIN_GAME_LENGTH +
                                                             " et " + CCommon.MAX_GAME_LENGTH + "caracteres";
  public static readonly GAME_TITLE_IS_CORRECT:     string = "Le titre est correct";

  // Constants for card-manager-controller
  public static readonly DEFAULT_CARD_ID:           number = 1;
  public static readonly DELETION_ERROR_MESSAGE:    string = "Impossible de supprimer la carte par défault";

  // Constants for game manager
  public static readonly PATH_TO_IMAGES:            string = CCommon.BASE_URL + "/image/";
  public static readonly PATH_TO_TEMP_IMAGES:       string = Constants.PATH_TO_IMAGES + "/temp/";
  public static readonly TEMP_IMAGES_PATH:          string = Constants.IMAGES_PATH + "/temp/";
  public static readonly NOT_UNIQUE_NAME:           string = "isNotUnique";
  public static readonly INIT_ARENA_ERROR:          string = "Erreur lors de l'initialisation de l'arène 2D";

  // Constants for user manager service
  public static readonly USER_NOT_FOUND:            string = "Utilisateur inexistant";
  public static readonly NAME_FORMAT_LENGTH_ERROR:  string = "Le nom doit contenir entre 4 et 15 characteres";
  public static readonly USER_NAME_ERROR:           string = "Le nom doit contenir seulement des caracteres alphanumériques";

  // Constants for arena.ts
  public static readonly FF:                        number = 255;
  public static readonly WHITE:                     number[] = [Constants.FF, Constants.FF, Constants.FF];
  public static readonly URL_HIT_VALIDATOR:         string = "http://localhost:3000/api/hitvalidator";
  public static readonly ONE_SECOND:                number = 1000;
  public static readonly ON_ERROR_PIXEL_CLUSTER:    IOriginalPixelCluster = { differenceKey: -1, cluster: [] };

  // Constants for scene manager service
  public static readonly MIN_ITEMS_IN_SCENE:        number = 10;
  public static readonly MAX_ITEMS_IN_SCENE:        number = 200;
  public static readonly THEME_GEOMETRIC:           string = "geometric";
  public static readonly THEME_THEMATIC:            string = "thematic";
}
