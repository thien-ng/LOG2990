import * as Axios from "axios";
import { inject, injectable } from "inversify";
import { DefaultCard2D, DefaultCard3D, GameMode, ICard } from "../../../common/communication/iCard";
import { ICardLists } from "../../../common/communication/iCardLists";
import { ISceneMessage } from "../../../common/communication/iSceneMessage";
import { ISceneVariablesMessage } from "../../../common/communication/iSceneVariables";
import { Message } from "../../../common/communication/message";
import { Constants } from "../constants";
import Types from "../types";
import { AssetManagerService } from "./asset-manager.service";
import { CardOperations } from "./card-operations.service";
import { ImageRequirements } from "./difference-checker/utilities/imageRequirements";

const axios: Axios.AxiosInstance = require("axios");

@injectable()
export class CardManagerService {
    private cards:                  ICardLists;

    private originalImageRequest:   Buffer;
    private modifiedImageRequest:   Buffer;
    private imageManagerService:    AssetManagerService;

    private uniqueId:               number;
    private uniqueIdScene:          number;

    public constructor( @inject(Types.CardOperations) private cardOperations: CardOperations) {

        this.uniqueId               = Constants.START_ID_2D;
        this.uniqueIdScene          = Constants.START_ID_3D;
        this.cards                  = cardOperations.getCardList();
        this.imageManagerService    = new AssetManagerService();

        this.cardOperations.addCard2D(DefaultCard2D);
        this.cardOperations.addCard3D(DefaultCard3D);
    }

    public async simpleCardCreationRoutine(requirements: ImageRequirements, cardTitle: string): Promise<Message> {
        const nameValidationStatus: Message = this.validateCardTitle(cardTitle);
        if (nameValidationStatus.title === Constants.ERROR_TITLE) {
            return nameValidationStatus;
        }

        this.originalImageRequest = requirements.originalImage;
        this.modifiedImageRequest = requirements.modifiedImage;

        let returnValue: Message = {
            title:  Constants.ON_ERROR_MESSAGE,
            body:   Constants.VALIDATION_FAILED,
        };
        try {
            await axios.post(Constants.PATH_FOR_2D_VALIDATION, requirements)
            .then((response: Axios.AxiosResponse< Buffer | Message>) => {
                returnValue = this.handlePostResponse(response, cardTitle);
            });
        } catch (error) {
            this.generateErrorMessage(error);
        }

        return returnValue;
    }

    public freeCardCreationRoutine(body: ISceneMessage): Message {
        const cardId:       number = this.generateSceneId();
        const sceneImage:   string = "/" + cardId + Constants.SCENE_SNAPSHOT;
        const scenesPath:   string = Constants.SCENE_PATH + "/" + cardId + Constants.SCENES_FILE;

        this.imageManagerService.saveImage(Constants.IMAGES_PATH + sceneImage, body.image);
        this.saveSceneJson(body.iSceneVariablesMessage, scenesPath);

        const cardReceived: ICard = {
            gameID:         cardId,
            gamemode:       GameMode.free,
            title:          body.iSceneVariablesMessage.originalScene.gameName,
            subtitle:       body.iSceneVariablesMessage.originalScene.gameName,
            avatarImageUrl: Constants.BASE_URL + "/image" + sceneImage,
            gameImageUrl:   Constants.BASE_URL + "/image" + sceneImage,
        };

        return this.generateMessage(cardReceived);
    }

    private saveSceneJson(body: ISceneVariablesMessage, path: string): void {
        const sceneObject: string = JSON.stringify(body);
        this.imageManagerService.saveGeneratedScene(path, sceneObject);
    }

    private generateMessage(cardReceived: ICard): Message {
        if (this.cardOperations.addCard3D(cardReceived)) {
            return {
                title:  Constants.ON_SUCCESS_MESSAGE,
                body:   Constants.CARD_ADDED,
            } as Message;
        } else {
            return {
                title:  Constants.ON_ERROR_MESSAGE,
                body:   Constants.CARD_EXISTING,
            } as Message;
        }
    }

    private handlePostResponse(response: Axios.AxiosResponse< Buffer | Message>, cardTitle: string): Message {
        const result: Buffer | Message = response.data;
        if (this.isMessage(result)) {
            return result;
        } else {
            const cardId:               number = this.generateId();
            const originalImagePath:    string = "/" + cardId + Constants.ORIGINAL_FILE;
            const modifiedImagePath:    string = "/" + cardId + Constants.MODIFIED_FILE;
            this.imageManagerService.stockImage(Constants.IMAGES_PATH + originalImagePath, this.originalImageRequest);
            this.imageManagerService.stockImage(Constants.IMAGES_PATH + modifiedImagePath, this.modifiedImageRequest);
            this.imageManagerService.createBMP(result, cardId);

            const cardReceived: ICard = {
                    gameID:         cardId,
                    title:          cardTitle,
                    subtitle:       cardTitle,
                    avatarImageUrl: Constants.BASE_URL + "/image" + originalImagePath,
                    gameImageUrl:   Constants.BASE_URL + "/image" + originalImagePath,
                    gamemode:       GameMode.simple,
            };

            return this.verifyCard(cardReceived);
        }
    }

    private verifyCard(card: ICard): Message {
        if (this.cardOperations.addCard2D(card)) {
            return {
                title:  Constants.ON_SUCCESS_MESSAGE,
                body:   "Card " + card.gameID + " created",
            } as Message;
        } else {
            return {
                title:  Constants.ON_ERROR_MESSAGE,
                body:   Constants.CARD_EXISTING,
            } as Message;
        }
    }

    private isMessage(result: Buffer | Message): result is Message {
        return  (result as Message).body    !== undefined &&
                (result as Message).title   !== undefined;
    }

    private generateId(): number {
        return this.uniqueId++;
    }

    private generateSceneId(): number {
        return this.uniqueIdScene++;
    }

    public isSceneNameNew(title: string): boolean {
        return !this.cards.list3D.some((card: ICard): boolean => {
            return card.title === title;
        });
    }

    public getCards(): ICardLists {
        return this.cards;
    }

    public generateErrorMessage(error: Error): Message {
        const isTypeError:  boolean = error instanceof TypeError;
        const errorMessage: string  = isTypeError ? error.message : Constants.UNKNOWN_ERROR;

        return {
            title:  Constants.ON_ERROR_MESSAGE,
            body:   errorMessage,
        };
    }

    private validateCardTitle(cardTitle: string): Message {

        if (!this.titleIsValid(cardTitle)) {
            return this.buildValidatorMessage(Constants.ERROR_TITLE, Constants.GAME_FORMAT_LENTGH_ERROR);
        }

        if (this.formatIsValid(cardTitle)) {
            return this.buildValidatorMessage(Constants.ERROR_TITLE, Constants.GAME_FORMAT_REGEX_ERROR);
        }

        return this.buildValidatorMessage(Constants.SUCCESS_TITLE, Constants.GAME_TITLE_IS_CORRECT);
    }

    private titleIsValid(cardTitle: string): boolean {
        return !(cardTitle.length < Constants.MIN_GAME_LENGTH || cardTitle.length > Constants.MAX_GAME_LENGTH);
    }

    private formatIsValid(cardTitle: string): boolean {
        const regex: RegExp = new RegExp(Constants.GAME_REGEX_PATTERN);

        return !regex.test(cardTitle);
    }

    private buildValidatorMessage(title: string, body: string): Message {
        return {
            title:  title,
            body:   body,
        };
    }
}
