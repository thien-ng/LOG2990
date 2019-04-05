export class CCommon {

    public static readonly BASE_URL:                  string = "http://localhost";
    // public static readonly BASE_URL:                  string = "http://10.200.2.107";
    public static readonly BASE_SERVER_PORT:          string = ":3000";
    
    public static readonly ORIGINAL_FILE:             string = "_original.bmp";
    public static readonly MODIFIED_FILE:             string = "_modified.bmp";
    public static readonly SCENE_FILE:                string = "_scene.json";
    
    public static readonly REGEX_PATTERN_ALPHANUM:    string = "^[a-zA-Z0-9 ]+$";
    
    public static readonly IS_UNIQUE:                 string = "isUnique";

    public static readonly MIN_GAME_LENGTH:           number = 5;
    public static readonly MAX_GAME_LENGTH:           number = 20;
    public static readonly MIN_NAME_LENGTH:           number = 4;
    public static readonly MAX_NAME_LENGTH:           number = 15;

    public static readonly ON_ARENA_CONNECT:          string = "onArenaConnect";
    public static readonly ON_ARENA_RESPONSE:         string = "onArenaResponse";
    public static readonly ON_CANCEL_GAME:            string = "onCancelGame";
    public static readonly ON_CANCEL_REQUEST:         string = "onCancelRequest";
    public static readonly ON_CARD_CREATED:           string = "onCardCreated";
    public static readonly ON_CARD_DELETED:           string = "onCardDeleted";
    public static readonly ON_CHAT_MESSAGE:           string = "onChatMessage";
    public static readonly ON_COUNTDOWN:              string = "onCountdown";
    public static readonly ON_COUNTDOWN_START:        string = "onCountdownStart";
    public static readonly ON_ERROR:                  string = "onError";
    public static readonly ON_GAME_ENDED:             string = "onGameEnded";
    public static readonly ON_GAME_LOADED:            string = "onGameLoaded";
    public static readonly ON_GAME_LOST:              string = "onGameLost";
    public static readonly ON_GAME_STARTED:           string = "onGameStarted";
    public static readonly ON_GAME_WON:               string = "onGameWon";
    public static readonly ON_GET_MODIF_LIST:         string = "onGetModifList";
    public static readonly ON_LOBBY:                  string = "onLobby";
    public static readonly ON_MODE_INVALID:           string = "onModeInvalid"
    public static readonly ON_NEW_SCORE:              string = "onNewScore";
    public static readonly ON_PENALTY:                string = "onPenalty";
    public static readonly ON_POINT_ADDED:            string = "onPointAdded";
    public static readonly ON_RECEIVE_MODIF_LIST:     string = "onReceiveModifList";
    public static readonly ON_RETRIEVE_USER:          string = "onRetrieveUser";
    public static readonly ON_SUCCESS:                string = "onSuccess";
    public static readonly ON_TIMER_UPDATE:           string = "onTimerUpdate";
    public static readonly ON_WAITING:                string = "onWaiting";
    public static readonly ERROR_HANDLING:            string = "onErrorHandling";
    public static readonly POSITION_VALIDATION:       string = "onPositionValidation"
    public static readonly GAME_CONNECTION:           string = "onGameConnection";
    public static readonly GAME_DISCONNECT:           string = "onGameDisconnect";
    public static readonly LOGIN_EVENT:               string = "onLogin";
    public static readonly USER_EVENT:                string = "onNewUser";
    public static readonly CHAT_EVENT:                string = "onChatEvent";

    public static readonly JOIN_TEXT:                 string = "JOINDRE";
    public static readonly CREATE_TEXT:               string = "CRÉER";
}