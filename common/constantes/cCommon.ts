export class CCommon {
    public static readonly BASE_URL:                  string = "http://localhost:3000";
    
    public static readonly ORIGINAL_FILE:             string = "_original.bmp";
    public static readonly MODIFIED_FILE:             string = "_modified.bmp";
    
    public static readonly REGEX_PATTERN_ALPHANUM:    string = "^[a-zA-Z0-9]+$";
    
    public static readonly IS_UNIQUE:                 string = "isUnique";

    public static readonly MIN_GAME_LENGTH:           number = 5;
    public static readonly MAX_GAME_LENGTH:           number = 20;
    public static readonly MIN_NAME_LENGTH:           number = 4;
    public static readonly MAX_NAME_LENGTH:           number = 15;

    public static readonly ON_ARENA_CONNECT:          string = "onArenaConnect";
    public static readonly ON_ARENA_RESPONSE:         string = "onArenaResponse";
    public static readonly ON_CHAT_MESSAGE:           string = "onChatMessage";
    public static readonly ON_ERROR:                  string = "onError";
    public static readonly ON_MODE_INVALID:           string = "onModeInvalid"
    public static readonly ON_POINT_ADDED:            string = "onPointAdded";
    public static readonly ON_RETRIEVE_USER:          string = "onRetrieveUser";
    public static readonly ON_SUCCESS:                string = "onSuccess";
    public static readonly ON_TIMER_UPDATE:           string = "onTimerUpdate";
    public static readonly ON_WAITING:                string = "onWaiting";
    public static readonly GAME_CONNECTION:           string = "onGameConnection";
    public static readonly GAME_DISCONNECT:           string = "onGameDisconnect";
    public static readonly LOGIN_EVENT:               string = "onLogin";
    public static readonly USER_EVENT:                string = "onNewUser";
    public static readonly CHAT_EVENT:                string = "onChatEvent";
}