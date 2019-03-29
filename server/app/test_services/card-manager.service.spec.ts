// import "reflect-metadata";

// import * as chai from "chai";
// import * as spies from "chai-spies";
// import * as fs from "fs";
// import * as path from "path";
// import { DefaultCard2D, DefaultCard3D, GameMode, ICard } from "../../../common/communication/iCard";
// import { ICardLists } from "../../../common/communication/iCardLists";
// import { ISceneMessage } from "../../../common/communication/iSceneMessage";
// import { ISceneObject } from "../../../common/communication/iSceneObject";
// import { ISceneOptions, SceneType } from "../../../common/communication/iSceneOptions";
// import { IModification, ISceneData, ISceneVariables, ModificationType } from "../../../common/communication/iSceneVariables";
// import { Message } from "../../../common/communication/message";
// import { CCommon } from "../../../common/constantes/cCommon";
// import { CServer } from "../CServer";
// import { AssetManagerService } from "../services/asset-manager.service";
// import { CardManagerService } from "../services/card-manager.service";
// import { CardOperations } from "../services/card-operations.service";
// import { ImageRequirements } from "../services/difference-checker/utilities/imageRequirements";
// import { HighscoreService } from "../services/highscore.service";
// import { SceneBuilder } from "../services/scene/scene-builder";
// import { SceneModifier } from "../services/scene/scene-modifier";

// /*tslint:disable no-magic-numbers no-any max-file-line-count max-line-length*/

// const FAKE_PATH:            string  = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT  + "/image";
// const mockAdapter:          any     = require("axios-mock-adapter");
// const axios:                any     = require("axios");
// const initCardsJson:    ICardLists = {
//     list2D: [
//         {
//             gameID: 1,
//             gamemode: GameMode.simple,
//             title: "Stewie deathray",
//             subtitle: "Default Image",
//             avatarImageUrl: "http://localhost:3000/image//default.gif",
//             gameImageUrl: "http://localhost:3000/image//default.gif",
//         },
//     ],
//     list3D: [
//         {
//             gameID: 2,
//             gamemode: GameMode.free,
//             title: "Scène par défaut",
//             subtitle: "Scène par défaut",
//             avatarImageUrl: "http://localhost:3000/image//2_snapshot.jpeg",
//             gameImageUrl: "http://localhost:3000/image//2_snapshot.jpeg",
//         },
//     ],
// };

// let modifiedList:           IModification[];
// let mockAxios:              any;
// let cardManagerService:     CardManagerService;
// let highscoreService:       HighscoreService;
// let cardOperations:         CardOperations;
// let assetManagerService:    AssetManagerService;

// describe("Card-manager tests", () => {
//     chai.use(spies);
//     const original: Buffer = fs.readFileSync(path.resolve(__dirname, "../asset/image/testBitmap/imagetestOg.bmp"));
//     const modified: Buffer = fs.readFileSync(path.resolve(__dirname, "../asset/image/testBitmap/imagetestOg.bmp"));

//     const cards: ICardLists = {
//         list2D: [DefaultCard2D],
//         list3D: [DefaultCard3D],
//     };

//     const modifications: IModification[] = [
//         { id: 0, type: ModificationType.added },
//         { id: 1, type: ModificationType.added },
//         { id: 2, type: ModificationType.changedColor },
//         { id: 3, type: ModificationType.changedColor },
//         { id: 4, type: ModificationType.removed },
//         { id: 5, type: ModificationType.removed },
//         { id: 6, type: ModificationType.removed },
//     ];

//     const c2: ICard = {
//         gameID:             4,
//         title:              "Default 3D",
//         subtitle:           "default 3D",
//         avatarImageUrl:     FAKE_PATH + "/moutain.jpg",
//         gameImageUrl:       FAKE_PATH + "/moutain.jpg",
//         gamemode:           GameMode.free,
//     };

//     const c3: ICard = {
//         gameID:             3,
//         title:              "Default 3D 2.0",
//         subtitle:           "default 3D",
//         avatarImageUrl:     FAKE_PATH + "/poly.jpg",
//         gameImageUrl:       FAKE_PATH + "/poly.jpg",
//         gamemode:           GameMode.free,
//     };

//     beforeEach(() => {
//         modifiedList        = [];
//         assetManagerService = new AssetManagerService();
//         highscoreService    = new HighscoreService();
//         cardOperations      = new CardOperations(highscoreService);
//         cardManagerService  = new CardManagerService(cardOperations);
//         mockAxios           = new mockAdapter.default(axios);
//     });

//     it("should return the list of all cards", () => {
//         chai.expect(cardManagerService.getCards()).deep.equal(cards);
//     });

//     it("should return new length of 3D list after adding a card", () => {
//         cardOperations.addCard3D(c2);
//         cardOperations.addCard3D(c3);
//         chai.expect(cardManagerService.getCards().list3D.length).to.equal(3);
//         cardOperations.removeCard3D(c2.gameID);
//         cardOperations.removeCard3D(c3.gameID);
//     });

//     it("should return the newly added card", () => {
//         cardOperations.addCard3D(c3);
//         chai.expect(cardManagerService.getCards().list3D[0]).deep.equal(c3);
//     });

//     it("should return undefined because there is no more card there", () => {
//         chai.expect(cardManagerService.getCards().list3D[3]).deep.equal(undefined);
//     });

//     it("should return an error message when doing axios get", async () => {
//         mockAxios.onGet("/api/differenceChecker/validate").reply(200, {
//             title: CCommon.ON_ERROR,
//             body: CServer.VALIDATION_FAILED,
//         });
//         const requirements: ImageRequirements = {
//             requiredHeight:     CServer.REQUIRED_HEIGHT,
//             requiredWidth:      CServer.REQUIRED_WIDTH,
//             requiredNbDiff:     CServer.REQUIRED_NB_DIFF,
//             originalImage:      original,
//             modifiedImage:      modified,
//         };

//         let messageTitle: string = "";
//         await cardManagerService.simpleCardCreationRoutine(requirements, "title")
//         .then((message: Message) => {
//             messageTitle = message.title;
//         });
//         chai.expect(messageTitle).to.equal("onError");

//         mockAxios.restore();
//     });
//     it("should return an success message when creating a freeCard successfully", () => {
//         const sceneOptions10: ISceneOptions = {
//             sceneName:              "10 objects",
//             sceneType:              SceneType.Geometric,
//             sceneObjectsQuantity:   10,
//             selectedOptions:        [false, false, false],
//         } as ISceneOptions;

//         const sceneBuilder:     SceneBuilder    = new SceneBuilder();
//         const sceneModifier:    SceneModifier   = new SceneModifier(sceneBuilder);
//         const isceneVariable:   ISceneVariables<ISceneObject> = sceneBuilder.generateScene(sceneOptions10);

//         const iSceneVariablesMessage:   ISceneData<ISceneObject>  = {
//             originalScene:          isceneVariable,
//             modifiedScene:          sceneModifier.modifyScene(sceneOptions10, isceneVariable, modifiedList),
//             modifications:          modifications,
//         };
//         const sceneMessage: ISceneMessage = {
//             sceneData: iSceneVariablesMessage,
//             image:                  "",
//         };
//         const message: Message = {
//             title:  CCommon.ON_SUCCESS,
//             body:   CServer.CARD_ADDED,
//         };
//         chai.expect(cardManagerService.freeCardCreationRoutine(sceneMessage)).to.deep.equal(message);

//         assetManagerService.deleteStoredImages(["./app/asset/scene/2000_scene.json", "./app/asset/image/2000_snapshot.jpeg"]);
//     });

//     it("Should return an error because free card already exist", () => {
//         const sceneOptions10: ISceneOptions = {
//             sceneName:              "10 objects",
//             sceneType:              SceneType.Geometric,
//             sceneObjectsQuantity:   10,
//             selectedOptions:        [false, false, false],
//         } as ISceneOptions;

//         const sceneBuilder:     SceneBuilder    = new SceneBuilder();
//         const sceneModifier:    SceneModifier   = new SceneModifier(sceneBuilder);
//         const isceneVariable:   ISceneVariables<ISceneObject> = sceneBuilder.generateScene(sceneOptions10);

//         const iSceneVariablesMessage: ISceneData<ISceneObject> = {
//             originalScene:          isceneVariable,
//             modifiedScene:          sceneModifier.modifyScene(sceneOptions10, isceneVariable, modifiedList),
//             modifications:          modifications,
//         };
//         const sceneMessage: ISceneMessage = {
//             sceneData: iSceneVariablesMessage,
//             image:                  "",
//         };

//         cardManagerService.freeCardCreationRoutine(sceneMessage);
//         chai.expect(cardManagerService.freeCardCreationRoutine(sceneMessage))
//         .to.deep.equal({title: "onError", body: "Le titre de la carte existe déjà"});
//         assetManagerService.deleteStoredImages(["./app/asset/scene/2000_scene.json", "./app/asset/image/2000_snapshot.jpeg"]);
//         assetManagerService.deleteStoredImages(["./app/asset/scene/2001_scene.json", "./app/asset/image/2001_snapshot.jpeg"]);
//         assetManagerService.saveCardsUpdate(initCardsJson);
//     });

//     it("Should return false when the title already exists", () => {
//         chai.expect(cardManagerService.isSceneNameNew("Scène par défaut")).to.equal(false);
//     });

//     it("Should return a message of success and simple create card", async () => {
//         const requirements: ImageRequirements = {
//             requiredHeight:     CServer.REQUIRED_HEIGHT,
//             requiredWidth:      CServer.REQUIRED_WIDTH,
//             requiredNbDiff:     CServer.REQUIRED_NB_DIFF,
//             originalImage:      original,
//             modifiedImage:      modified,
//         };
//         mockAxios.onPost(CServer.PATH_FOR_2D_VALIDATION).reply(200, original);

//         await cardManagerService.simpleCardCreationRoutine(requirements, "title").then((response: any) => {
//             chai.expect(response).to.deep.equal({ title: "onSuccess", body: "Card 1000 created" });
//         });

//         const paths: string[] = [
//             "./app/asset/image/1000_generated.bmp",
//             "./app/asset/image/1000_modified.bmp",
//             "./app/asset/image/1000_original.bmp",
//         ];

//         assetManagerService.deleteStoredImages(paths);
//         assetManagerService.saveCardsUpdate(initCardsJson);
//         mockAxios.restore();
//     });

//     it("Should return error because simple card title exist already", async () => {
//         const requirements: ImageRequirements = {
//             requiredHeight:     CServer.REQUIRED_HEIGHT,
//             requiredWidth:      CServer.REQUIRED_WIDTH,
//             requiredNbDiff:     CServer.REQUIRED_NB_DIFF,
//             originalImage:      original,
//             modifiedImage:      modified,
//         };
//         mockAxios.onPost(CServer.PATH_FOR_2D_VALIDATION).reply(200, original);
//         await cardManagerService.simpleCardCreationRoutine(requirements, "title").then();
//         await cardManagerService.simpleCardCreationRoutine(requirements, "title").then((response: any) => {
//             chai.expect(response).to.deep.equal({ title: "onError", body: "Le titre de la carte existe déjà" });
//         });

//         const paths: string[] = [
//             "./app/asset/image/1000_generated.bmp",
//             "./app/asset/image/1000_modified.bmp",
//             "./app/asset/image/1000_original.bmp",
//             "./app/asset/image/1001_generated.bmp",
//             "./app/asset/image/1001_modified.bmp",
//             "./app/asset/image/1001_original.bmp",
//         ];

//         assetManagerService.deleteStoredImages(paths);
//         assetManagerService.saveCardsUpdate(initCardsJson);
//         mockAxios.restore();
//     });

//     it("Should return an error while creating simple card", async () => {
//         const requirements: ImageRequirements = {
//             requiredHeight:     CServer.REQUIRED_HEIGHT,
//             requiredWidth:      CServer.REQUIRED_WIDTH,
//             requiredNbDiff:     CServer.REQUIRED_NB_DIFF,
//             originalImage:      original,
//             modifiedImage:      modified,
//         };

//         const message: Message = {
//             title:  "test",
//             body:   "ok",
//         };
//         mockAxios.onPost(CServer.PATH_FOR_2D_VALIDATION).reply(200, message);

//         await cardManagerService.simpleCardCreationRoutine(requirements, "title").then((response: any) => {
//             chai.expect(response).to.deep.equal(message);
//         });
//         assetManagerService.saveCardsUpdate(initCardsJson);
//         mockAxios.restore();
//     });

//     it("should return an unknown error when error message is not handled", async () => {
//         const typeError:    TypeError   = new TypeError("men calice");
//         const result:       any         = cardManagerService.generateErrorMessage(typeError);

//         chai.expect(result).to.deep.equal({title: CCommon.ON_ERROR, body: typeError.message});
//     });
// });

// describe("cardManagerService CardTitle test", () => {
//     const original: Buffer = fs.readFileSync(path.resolve(__dirname, "../asset/image/testBitmap/imagetestOg.bmp"));
//     const modified: Buffer = fs.readFileSync(path.resolve(__dirname, "../asset/image/testBitmap/imagetestOg.bmp"));

//     const requirements: ImageRequirements = {
//         requiredHeight:     CServer.REQUIRED_HEIGHT,
//         requiredWidth:      CServer.REQUIRED_WIDTH,
//         requiredNbDiff:     CServer.REQUIRED_NB_DIFF,
//         originalImage:      original,
//         modifiedImage:      modified,
//     };

//     it ("should return error of game title length if name is too short", (done: Function) => {
//         let messageTitle: string = "";
//         cardManagerService.simpleCardCreationRoutine(requirements, "123")
//         .then((message: Message) => {
//             messageTitle = message.body;
//             chai.expect(messageTitle).to.equal(CServer.GAME_FORMAT_LENTGH_ERROR);
//         }).catch();

//         done();
//     });

//     it ("should return error of game title length if name is too long", (done: Function) => {
//         let messageTitle: string = "";
//         cardManagerService.simpleCardCreationRoutine(requirements, "superTitreDeJeuBeaucoupTropLong")
//         .then((message: Message) => {
//             messageTitle = message.body;
//             chai.expect(messageTitle).to.equal(CServer.GAME_FORMAT_LENTGH_ERROR);
//         }).catch();

//         done();
//     });

//     it ("should return error of game title regex format if game title contains non alphanumeric character", (done: Function) => {
//         let messageTitle: string = "";
//         cardManagerService.simpleCardCreationRoutine(requirements, "titre*@#$")
//         .then((message: Message) => {
//             messageTitle = message.body;
//             chai.expect(messageTitle).to.equal(CServer.GAME_NAME_ERROR);
//         }).catch();

//         done();
//     });
// });
// /*tslint:disable max-file-line-count */
