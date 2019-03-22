import * as chai from "chai";
import * as spies from "chai-spies";
import { IArenaResponse, IOriginalPixelCluster, IPosition2D, ISceneObjectUpdate } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";
import { CardOperations } from "../../../services/card-operations.service";
import { ChatManagerService } from "../../../services/chat-manager.service";
import { Arena2D } from "../../../services/game/arena/arena2d";
import { Arena3D } from "../../../services/game/arena/arena3d";
import { I2DInfos, I3DInfos, IArenaInfos, IHitConfirmation, IHitToValidate } from "../../../services/game/arena/interfaces";
import { Player } from "../../../services/game/arena/player";
import { Referee } from "../../../services/game/arena/referee";
import { Timer } from "../../../services/game/arena/timer";
import { GameManagerService } from "../../../services/game/game-manager.service";
import { LobbyManagerService } from "../../../services/game/lobby-manager.service";
import { HighscoreService } from "../../../services/highscore.service";
import { InterfaceBuilder } from "../../../services/interface-generator";
import { TimeManagerService } from "../../../services/time-manager.service";
import { UserManagerService } from "../../../services/user-manager.service";

// tslint:disable no-magic-numbers no-any await-promise no-floating-promises max-file-line-count max-line-length

let   mockAxios:            any;
const axios:                any = require("axios");
const mockAdapter:          any = require("axios-mock-adapter");

const activeUser1: IUser = {
    username: "mike",
    socketID: "12323",
};

const activeUser2: IUser = {
    username: "michel",
    socketID: "12312",
};

const event2D: IPosition2D = {x: 1, y: 1};
const originalElements2D: Map<number, IOriginalPixelCluster> = new Map<number, IOriginalPixelCluster>();
const originalElements3D: Map<number, ISceneObjectUpdate>    = new Map<number, ISceneObjectUpdate>();

const hitConfirmation2D: IHitConfirmation = {
    isAHit:             true,
    differenceIndex:    1,
};

const arenaInfo2D: IArenaInfos<I2DInfos> = {
    arenaId:            1,
    users:              [activeUser1],
    dataUrl:            {
        original:       "http://localhost:3000/image/1_original.bmp",
        difference:     "http://localhost:3000/image/1_generated.bmp",
    },
};

const arenaInfo3D: IArenaInfos<I3DInfos> = {
    arenaId:            1,
    users:              [activeUser1],
    dataUrl:            {
        sceneData:      "url",
    },
};

const replacement: IOriginalPixelCluster = {
    differenceKey: 1,
    cluster: [
        {
            color:      {R: 1, G: 1, B: 1},
            position:   {x: 1, y: 1},
        },
    ],
};

const responseArena: IArenaResponse<IOriginalPixelCluster> = {
    status:     "onSuccess",
    response:   {
        differenceKey: 1,
        cluster: [
            {
                color:      {R: 1, G: 1, B: 1},
                position:   {x: 1, y: 1},
            },
        ],
    },
};

const postData: IHitToValidate<IPosition2D> = {
    eventInfo:          event2D,
    differenceDataURL:  "url",
    colorToIgnore:      255,
};

const url2D: string = "http://localhost:3000/api/hitvalidator/simple";

let gameManagerService:     GameManagerService;
let userManagerService:     UserManagerService;
let highscoreService:       HighscoreService;
let chatManagerService:     ChatManagerService;
let timeManagerService:     TimeManagerService;
let interfaceBuilder:       InterfaceBuilder;
let lobbyManagerService:    LobbyManagerService;
let cardOperations:         CardOperations;
let arena2D:                Arena2D;
let arena3D:                Arena3D;
let timer:                  Timer;

originalElements2D.set(1, replacement);

describe("Referee tests", () => {

    beforeEach(async () => {
        chai.use(spies);
        interfaceBuilder    = new InterfaceBuilder();
        lobbyManagerService = new LobbyManagerService();
        mockAxios           = new mockAdapter.default(axios);
        timer               = new Timer();
        userManagerService  = new UserManagerService();
        highscoreService    = new HighscoreService();
        timeManagerService  = new TimeManagerService();
        chatManagerService  = new ChatManagerService(timeManagerService);
        cardOperations      = new CardOperations(highscoreService);
        gameManagerService  = new GameManagerService(userManagerService, highscoreService, chatManagerService, cardOperations, lobbyManagerService, interfaceBuilder);
        arena2D             = new Arena2D(arenaInfo2D, gameManagerService);
        arena3D             = new Arena3D(arenaInfo3D, gameManagerService);
    });

    afterEach(() => {
        mockAxios.restore();
    });

    it("should return the array of foundDifferences", async () => {
        const playerList: Player[] = [new Player(activeUser2)];
        const referee: Referee<IPosition2D, IOriginalPixelCluster> = new Referee<IPosition2D, IOriginalPixelCluster>(arena2D, playerList, originalElements2D, timer, "url");

        referee["differencesFound"] = [1];

        const result: number[] = referee.getFoundDifferences();
        chai.expect(result.length).to.equal(1);
    });

    it("should return a failed click arena response (2D arena)", async () => {
        const playerList: Player[] = [new Player(activeUser2)];
        const referee: Referee<IPosition2D, IOriginalPixelCluster> = new Referee<IPosition2D, IOriginalPixelCluster>(arena2D, playerList, originalElements2D, timer, "url");

        const responseArenaError: IArenaResponse<IOriginalPixelCluster> = {
            status:     "onFailedClick",
            response:   undefined,
        };

        referee.onPlayerClick(event2D, activeUser1).then((response: IArenaResponse<IOriginalPixelCluster>) => {
            chai.expect(response).to.deep.equal(responseArenaError);
        }).catch();
    });

    it("should return a onPenalty state (2D arena)", async () => {
        const playerList:   Player[] = [new Player(activeUser1)];
        const referee:      Referee<IPosition2D, IOriginalPixelCluster> = new Referee<IPosition2D, IOriginalPixelCluster>(arena2D, playerList, originalElements2D, timer, "url");
        playerList[0].setPenaltyState(true);

        const responseArenaPenalty: IArenaResponse<IOriginalPixelCluster> = {
            status:     "onPenalty",
            response:   undefined,
        };

        referee.onPlayerClick(event2D, activeUser1).then((response: IArenaResponse<IOriginalPixelCluster>) => {
            chai.expect(response).to.deep.equal(responseArenaPenalty);
        }).catch();
    });

    it("should validate a good hit (2D arena single)", async () => {
        const playerList:   Player[] = [new Player(activeUser1)];
        const referee:      Referee<IPosition2D, IOriginalPixelCluster> = new Referee<IPosition2D, IOriginalPixelCluster>(arena2D, playerList, originalElements2D, timer, "url");

        mockAxios.onPost(url2D, postData).reply(200, hitConfirmation2D);

        referee.validateHit(event2D).then((response: IHitConfirmation) => {
            chai.expect(response).to.deep.equal(hitConfirmation2D);
        }).catch();
    });

    it("should validate a good hit (2D arena multi)", async () => {
        const playerList:   Player[] = [new Player(activeUser1), new Player(activeUser2)];
        const referee:      Referee<IPosition2D, IOriginalPixelCluster> = new Referee<IPosition2D, IOriginalPixelCluster>(arena2D, playerList, originalElements2D, timer, "url");

        mockAxios.onPost(url2D, postData).reply(200, hitConfirmation2D);

        referee.validateHit(event2D).then((response: IHitConfirmation) => {
            chai.expect(response).to.deep.equal(hitConfirmation2D);
        }).catch();
    });

    it("should return error when validateHit (2D arena single)", async () => {
        const playerList:   Player[] = [new Player(activeUser1)];
        const referee:      Referee<IPosition2D, IOriginalPixelCluster> = new Referee<IPosition2D, IOriginalPixelCluster>(arena2D, playerList, originalElements2D, timer, "url");

        mockAxios.onPost(url2D, postData).reply(400);

        referee.validateHit(event2D).then().catch((error: any) => {
            chai.expect(error.message).to.equal("Problem during Hit Validation process.");
        });
    });

    it("should return error when validateHit (3D arena single)", async () => {
        const playerList:   Player[] = [new Player(activeUser1), new Player(activeUser2)];
        const referee:      Referee<IPosition2D, IOriginalPixelCluster> = new Referee<IPosition2D, IOriginalPixelCluster>(arena2D, playerList, originalElements2D, timer, "url");

        mockAxios.onPost(url2D, postData).reply(400);

        referee.validateHit(event2D).then().catch((error: any) => {
            chai.expect(error.message).to.equal("Problem during Hit Validation process.");
        });
    });

    it("should validate a good hit when onPlayerClick (2D arena single)", async () => {
        const playerList:   Player[] = [new Player(activeUser1)];
        const referee:      Referee<IPosition2D, IOriginalPixelCluster> = new Referee<IPosition2D, IOriginalPixelCluster>(arena2D, playerList, originalElements2D, timer, "url");

        referee["differencesFound"] = [];

        mockAxios.onPost(url2D, postData).reply(200, hitConfirmation2D);

        referee.onPlayerClick(event2D, activeUser1).then((response: IArenaResponse<IOriginalPixelCluster>) => {
            chai.expect(response).to.deep.equal(responseArena);
        }).catch();
    });

    it("should validate a good hit when onPlayerClick (2D arena multi)", async () => {
        const playerList:   Player[] = [new Player(activeUser1), new Player(activeUser2)];
        const referee:      Referee<IPosition2D, IOriginalPixelCluster> = new Referee<IPosition2D, IOriginalPixelCluster>(arena2D, playerList, originalElements2D, timer, "url");

        referee["differencesFound"] = [];

        mockAxios.onPost(url2D, postData).reply(200, hitConfirmation2D);

        referee.onPlayerClick(event2D, activeUser1).then((response: IArenaResponse<IOriginalPixelCluster>) => {
            chai.expect(response).to.deep.equal(responseArena);
        }).catch();
    });

    it("should validate a wrong hit when onPlayerClick (2D arena single)", async () => {
        const playerList:   Player[] = [new Player(activeUser1)];
        const referee:      Referee<IPosition2D, IOriginalPixelCluster> = new Referee<IPosition2D, IOriginalPixelCluster>(arena2D, playerList, originalElements2D, timer, "url");

        const notHitConfirmation2D: IHitConfirmation = {
            isAHit:             false,
            differenceIndex:    1,
        };

        const wrongResponse: IArenaResponse<IOriginalPixelCluster> = {
            status:     "onFailedClick",
            response:   undefined,
        };

        referee["differencesFound"] = [];

        mockAxios.onPost(url2D, postData).reply(200, notHitConfirmation2D);

        referee.onPlayerClick(event2D, activeUser1).then((response: IArenaResponse<IOriginalPixelCluster>) => {
            chai.expect(response).to.deep.equal(wrongResponse);
        }).catch();
    });

    it("should validate a wrong hit when onPlayerClick (2D arena multi)", async () => {
        const playerList:   Player[] = [new Player(activeUser1), new Player(activeUser2)];
        const referee:      Referee<IPosition2D, IOriginalPixelCluster> = new Referee<IPosition2D, IOriginalPixelCluster>(arena2D, playerList, originalElements2D, timer, "url");

        const notHitConfirmation2D: IHitConfirmation = {
            isAHit:             false,
            differenceIndex:    1,
        };

        const wrongResponse: IArenaResponse<IOriginalPixelCluster> = {
            status:     "onFailedClick",
            response:   undefined,
        };

        referee["differencesFound"] = [];

        mockAxios.onPost(url2D, postData).reply(200, notHitConfirmation2D);

        referee.onPlayerClick(event2D, activeUser1).then((response: IArenaResponse<IOriginalPixelCluster>) => {
            chai.expect(response).to.deep.equal(wrongResponse);
        }).catch();
    });

    it("should return a failed click arena response (3D arena)", async () => {
        const playerList:   Player[] = [new Player(activeUser2)];
        const referee:      Referee<number, ISceneObjectUpdate> = new Referee<number, ISceneObjectUpdate>(arena3D, playerList, originalElements3D, timer, "url");

        const responseArenaError: IArenaResponse<ISceneObjectUpdate> = {
            status:     "onFailedClick",
            response:   undefined,
        };

        referee.onPlayerClick(1, activeUser1).then((response: IArenaResponse<ISceneObjectUpdate>) => {
            chai.expect(response).to.deep.equal(responseArenaError);
        }).catch();
    });

    it("should return a onPenalty state (3D arena)", async () => {
        const playerList:   Player[] = [new Player(activeUser1)];
        const referee:      Referee<number, ISceneObjectUpdate> = new Referee<number, ISceneObjectUpdate>(arena3D, playerList, originalElements3D, timer, "url");
        playerList[0].setPenaltyState(true);

        const responseArenaPenalty: IArenaResponse<ISceneObjectUpdate> = {
            status:     "onPenalty",
            response:   undefined,
        };

        referee.onPlayerClick(1, activeUser1).then((response: IArenaResponse<ISceneObjectUpdate>) => {
            chai.expect(response).to.deep.equal(responseArenaPenalty);
        }).catch();
    });

    it("should throw an error when onPlayerClick (3D arena)", async () => {
        const playerList:   Player[] = [new Player(activeUser1)];
        const referee:      Referee<number, ISceneObjectUpdate> = new Referee<number, ISceneObjectUpdate>(arena3D, playerList, originalElements3D, timer, "url");

        const responseArenaError: IArenaResponse<ISceneObjectUpdate> = {
            status:     "onError",
            response:   undefined,
        };

        referee.onPlayerClick(1, activeUser1).then((response: IArenaResponse<ISceneObjectUpdate>) => {
            chai.expect(response).to.deep.equal(responseArenaError);
        }).catch();
    });

});
