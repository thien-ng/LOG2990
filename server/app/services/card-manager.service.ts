import * as Axios from "axios";
import { inject, injectable } from "inversify";
import { DefaultCard2D, DefaultCard3D, GameMode, ICard } from "../../../common/communication/iCard";
import { ICardLists } from "../../../common/communication/iCardLists";
import { ISceneMessage } from "../../../common/communication/iSceneMessage";
import { Message } from "../../../common/communication/message";
import { Constants } from "../constants";
import Types from "../types";
import { AssetManagerService } from "./asset-manager.service";
import { ImageRequirements } from "./difference-checker/utilities/imageRequirements";
import { HighscoreService } from "./highscore.service";

const axios: Axios.AxiosInstance = require("axios");
const DECIMAL: number = 10;
const DOESNT_EXIST: number = -1;
const CARD_DELETED: string = "Carte supprimée";
const CARD_ADDED: string = "Carte ajoutée";
const CARD_EXISTING: string = "Le ID ou le titre de la carte existe déja";
const CARD_NOT_FOUND: string = "Erreur de suppression, carte pas trouvée";
const REQUIRED_HEIGHT: number = 480;
const REQUIRED_WIDTH: number = 640;
const REQUIRED_NB_DIFF: number = 7;
const IMAGES_PATH: string = "./app/asset/image";
const SCENE_PATH: string = "./app/asset/scene";
const START_ID_2D: number = 1000;
const START_ID_3D: number = 2000;

@injectable()
export class CardManagerService {
    private cards: ICardLists;

    private originalImageRequest: Buffer;
    private modifiedImageRequest: Buffer;
    private imageManagerService: AssetManagerService;

    private uniqueId: number;
    private uniqueIdScene: number;

    public constructor(
        @inject(Types.HighscoreService) private highscoreService: HighscoreService) {

        this.uniqueId = START_ID_2D;
        this.uniqueIdScene = START_ID_3D;
        this.cards = {
            list2D: [],
            list3D: [],
        };
        this.addCard2D(DefaultCard2D);
        this.addCard3D(DefaultCard3D);
        this.imageManagerService = new AssetManagerService();
    }

    public async simpleCardCreationRoutine(original: Buffer, modified: Buffer, cardTitle: string): Promise<Message> {
        this.originalImageRequest = original;
        this.modifiedImageRequest = modified;

        const requirements: ImageRequirements = {
                                                    requiredHeight: REQUIRED_HEIGHT,
                                                    requiredWidth: REQUIRED_WIDTH,
                                                    requiredNbDiff: REQUIRED_NB_DIFF,
                                                    originalImage: original,
                                                    modifiedImage: modified,
                                                };
        let returnValue: Message = {
            title: Constants.ON_ERROR_MESSAGE,
            body: Constants.VALIDATION_FAILED,
        };
        try {
            await axios.post(Constants.PATH_FOR_2D_VALIDATION, requirements)
            .then((response: Axios.AxiosResponse< Buffer | Message>) => {
                returnValue = this.handlePostResponse(response, cardTitle);
                },
            );
        } catch (error) {// A DEMANDER AU CHARGE
            this.generateErrorMessage(error);
        }

        return returnValue;
    }

    private saveSeceneJson(body: ISceneMessage, path: string): void {
        const sceneObject: string = JSON.stringify(body.sceneVariable);
        this.imageManagerService.saveSceneGenerated(path, sceneObject);
    }

    public freeCardCreationRoutine(body: ISceneMessage): Message {

        const cardId: number = this.generateSceneId();
        const sceneImage: string = "/" + cardId + Constants.SCENE_SNAPSHOT;
        const sceneOriginal: string = SCENE_PATH + "/" + cardId + Constants.ORIGINAL_SCENE_FILE;

        this.imageManagerService.saveImage(IMAGES_PATH + sceneImage, body.image);
        this.saveSeceneJson(body, sceneOriginal);

        const cardReceived: ICard = {
            gameID: cardId,
            gamemode: GameMode.free,
            title: body.sceneVariable.gameName,
            subtitle: body.sceneVariable.gameName,
            avatarImageUrl: Constants.BASE_URL + "/image" + sceneImage,
            gameImageUrl: Constants.BASE_URL + "/image" + sceneImage,
        };

        return this.generateMessage(cardReceived);

    }

    private generateMessage(cardReceived: ICard): Message {
        if (this.addCard3D(cardReceived)) {
            return {
                title: Constants.ON_SUCCESS_MESSAGE,
                body: CARD_ADDED,
            } as Message;
        } else {
            return {
                title: Constants.ON_ERROR_MESSAGE,
                body: CARD_EXISTING,
            } as Message;
        }
    }

    private handlePostResponse(response: Axios.AxiosResponse< Buffer | Message>, cardTitle: string): Message {

        const result: Buffer | Message = response.data;
        if (this.isMessage(result)) {
            return result;
        } else {
            const cardId: number = this.generateId();
            const originalImagePath: string = "/" + cardId + Constants.ORIGINAL_FILE;
            const modifiedImagePath: string = "/" + cardId + Constants.MODIFIED_FILE;
            this.imageManagerService.stockImage(IMAGES_PATH + originalImagePath, this.originalImageRequest);
            this.imageManagerService.stockImage(IMAGES_PATH + modifiedImagePath, this.modifiedImageRequest);
            this.imageManagerService.createBMP(result, cardId);
            const cardReceived: ICard = {
                    gameID: cardId,
                    title: cardTitle,
                    subtitle: cardTitle,
                    avatarImageUrl: Constants.BASE_URL + "/image" + originalImagePath,
                    gameImageUrl: Constants.BASE_URL + "/image" + originalImagePath,
                    gamemode: GameMode.simple,
            };

            return this.verifyCard(cardReceived);
        }
    }

    private verifyCard(card: ICard): Message {
        if (this.addCard2D(card)) {
            return {
                title: Constants.ON_SUCCESS_MESSAGE,
                body: "Card " + card.gameID + " created",
            } as Message;
        } else {
            return {
                title: Constants.ON_ERROR_MESSAGE,
                body: CARD_EXISTING,
            } as Message;
        }
    }

    private isMessage(result: Buffer | Message): result is Message {
        return  (result as Message).body !== undefined &&
                (result as Message).title !== undefined;
    }

    private generateId(): number {
        return this.uniqueId++;
    }

    private generateSceneId(): number {
        return this.uniqueIdScene++;
    }

    private cardEqual(card: ICard, element: ICard): boolean {
        return (element.gameID === card.gameID ||
                element.title === card.title);
    }

    public addCard2D(card: ICard): boolean {
        let isExisting: boolean = false;
        this.cards.list2D.forEach((element: ICard) => {
            if (this.cardEqual(card, element)) {
                isExisting = true;
            }
        });
        if (!isExisting) {
            this.cards.list2D.unshift(card);
            this.highscoreService.createHighscore(card.gameID);
        }

        return !isExisting;
    }

    public addCard3D(card: ICard): boolean {
        let isExisting: boolean = false;
        this.cards.list3D.forEach((element: ICard) => {
            if (this.cardEqual(card, element)) {
                isExisting = true;
            }
        });
        if (!isExisting) {
            this.cards.list3D.unshift(card);
            this.highscoreService.createHighscore(card.gameID);

        }

        return !isExisting;
    }

    public getCards(): ICardLists {
        return this.cards;
    }

    private findCard2D(id: number): number {
        let index: number = DOESNT_EXIST;
        this.cards.list2D.forEach((card: ICard) => {
                if (card.gameID === id) {
                    index = this.cards.list2D.indexOf(card);
                }
        });

        return index;
    }

    private findCard3D(id: number): number {
        let index: number = DOESNT_EXIST;
        this.cards.list3D.forEach((card: ICard) => {
                if (card.gameID === id) {
                    index = this.cards.list3D.indexOf(card);
                }
        });

        return index;
    }

    public removeCard2D(id: number): string {
        if (id === Constants.DEFAULT_CARD_ID) {
            return Constants.DELETION_ERROR_MESSAGE;
        }
        const index: number = this.findCard2D(id);
        const paths: string[] = [
                                    IMAGES_PATH + "/" + id + Constants.GENERATED_FILE,
                                    IMAGES_PATH + "/" + id + Constants.ORIGINAL_FILE,
                                    IMAGES_PATH + "/" + id + Constants.MODIFIED_FILE,
                                ];
        if (index !== DOESNT_EXIST) {
            try {
                this.imageManagerService.deleteStoredImages(paths);
                this.cards.list2D.splice(index, 1);
            } catch (error) {
                return this.generateErrorMessage(error).title;
            }

            return CARD_DELETED;
        }

        return CARD_NOT_FOUND;
    }

    public removeCard3D(id: number): string {
        if (id === Constants.DEFAULT_CARD_ID) {
            return Constants.DELETION_ERROR_MESSAGE;
        }
        const index: number = this.findCard3D(id);
        if (index !== DOESNT_EXIST) {
            const paths: string[] = [
                IMAGES_PATH + "/" + id + Constants.GENERATED_SNAPSHOT,
                SCENE_PATH + "/" + id + Constants.ORIGINAL_SCENE_FILE,
            ];
            try {
                this.imageManagerService.deleteStoredImages(paths);
                this.cards.list3D.splice(index, 1);
            } catch (error) {
                return this.generateErrorMessage(error).title;
            }

            return CARD_DELETED;
        }

        return CARD_NOT_FOUND;
    }

    public getCardById(id: string, gamemode: GameMode): ICard {
        const cardID: number = parseInt(id, DECIMAL);

        return (gamemode === GameMode.simple) ? this.cards.list2D[this.findCard2D(cardID)] : this.cards.list3D[this.findCard3D(cardID)];
    }

    private generateErrorMessage(error: Error): Message {
        const isTypeError: boolean = error instanceof TypeError;
        const errorMessage: string = isTypeError ? error.message : Constants.UNKNOWN_ERROR;

        return {
            title: Constants.ON_ERROR_MESSAGE,
            body: errorMessage,
        };
    }
}
