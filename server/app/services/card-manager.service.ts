import * as Axios from "axios";
import { inject, injectable } from "inversify";
import { DefaultCard2D, DefaultCard3D, DefaultCard3DTheme, GameMode, ICard } from "../../../common/communication/iCard";
import { ICardsIds, ICardDescription, ICardLists } from "../../../common/communication/iCardLists";
import { ISceneMessage } from "../../../common/communication/iSceneMessage";
import { IMesh, ISceneObject } from "../../../common/communication/iSceneObject";
import { ISceneData } from "../../../common/communication/iSceneVariables";
import { Message } from "../../../common/communication/message";
import { CCommon } from "../../../common/constantes/cCommon";
import { CServer } from "../CServer";
import Types from "../types";
import { AssetManagerService } from "./asset-manager.service";
import { CardOperations } from "./card-operations.service";
import { ImageRequirements } from "./difference-checker/utilities/imageRequirements";

const axios: Axios.AxiosInstance = require("axios");

const INITIAL_2D_ID: number = 1000;
const INITIAL_3D_ID: number = 2000;

@injectable()
export class CardManagerService {

    private originalImageRequest:   Buffer;
    private modifiedImageRequest:   Buffer;
    private imageManagerService:    AssetManagerService;

    public constructor(@inject(Types.CardOperations) private cardOperations: CardOperations) {
        this.imageManagerService    = new AssetManagerService();

        this.cardOperations.removeDefaultGame();
        this.cardOperations.addCard(DefaultCard2D);
        this.cardOperations.addCard(DefaultCard3D);
        this.cardOperations.addCard(DefaultCard3DTheme);
    }

    public async simpleCardCreationRoutine(requirements: ImageRequirements, cardTitle: string): Promise<Message> {
        const nameValidationStatus: Message = this.validateCardTitle(cardTitle);
        if (nameValidationStatus.title === CCommon.ON_ERROR) {
            return nameValidationStatus;
        }

        this.originalImageRequest = requirements.originalImage;
        this.modifiedImageRequest = requirements.modifiedImage;

        let returnValue: Message = {
            title:  CCommon.ON_ERROR,
            body:   CServer.VALIDATION_FAILED,
        };
        try {
            await axios.post(CServer.PATH_FOR_2D_VALIDATION, requirements)
            .then((response: Axios.AxiosResponse< Buffer | Message>) => {
                returnValue = this.handlePostResponse(response, cardTitle);
            });
        } catch (error) {

            return this.generateErrorMessage(error);
        }

        return returnValue;
    }

    public freeCardCreationRoutine(body: ISceneMessage): Message {
        const gameID:       number = this.generateId(INITIAL_3D_ID);
        const sceneImage:   string = "/" + gameID + CServer.SCENE_SNAPSHOT;
        const scenesPath:   string = CServer.SCENE_PATH + "/" + gameID + CCommon.SCENE_FILE;

        this.imageManagerService.saveImage(CServer.IMAGES_PATH + sceneImage, body.image);
        this.saveSceneJson(body.sceneData, scenesPath);

        const cardReceived: ICard = {
            gameID:         gameID,
            gamemode:       GameMode.free,
            title:          body.sceneData.originalScene.gameName,
            subtitle:       body.sceneData.originalScene.gameName,
            avatarImageUrl: CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + "/image" + sceneImage,
            gameImageUrl:   CCommon.BASE_URL + CCommon.BASE_SERVER_PORT  + "/image" + sceneImage,
        };

        return this.generateMessage(cardReceived);
    }

    private saveSceneJson(body: ISceneData<ISceneObject | IMesh>, path: string): void {
        const sceneObject: string = JSON.stringify(body);
        this.imageManagerService.saveGeneratedScene(path, sceneObject);
    }

    private generateMessage(cardReceived: ICard): Message {
        return this.cardOperations.addCard(cardReceived) ? {
            title:  CCommon.ON_SUCCESS,
            body:   CServer.CARD_ADDED,
        } : {
            title:  CCommon.ON_ERROR,
            body:   CServer.CARD_EXISTING,
        };
    }

    private handlePostResponse(response: Axios.AxiosResponse< Buffer | Message>, cardTitle: string): Message {
        const result: Buffer | Message = response.data;
        if (this.isMessage(result)) {
            return result;
        } else {
            let gameID: number;
            try {
                gameID = this.generateId(INITIAL_2D_ID);
            } catch (error) {
                return this.generateErrorMessage(error.message);
            }
            const originalImagePath:    string = "/" + gameID + CCommon.ORIGINAL_FILE;
            const modifiedImagePath:    string = "/" + gameID + CCommon.MODIFIED_FILE;
            this.imageManagerService.stockImage(CServer.IMAGES_PATH + originalImagePath, this.originalImageRequest);
            this.imageManagerService.stockImage(CServer.IMAGES_PATH + modifiedImagePath, this.modifiedImageRequest);
            this.imageManagerService.createBMP(result, gameID);

            const cardReceived: ICard = {
                    gameID:         gameID,
                    title:          cardTitle,
                    subtitle:       cardTitle,
                    avatarImageUrl: CCommon.BASE_URL + CCommon.BASE_SERVER_PORT  + "/image" + originalImagePath,
                    gameImageUrl:   CCommon.BASE_URL + CCommon.BASE_SERVER_PORT  + "/image" + originalImagePath,
                    gamemode:       GameMode.simple,
            };

            return this.verifyCard(cardReceived);
        }
    }

    private verifyCard(card: ICard): Message {
        return (this.cardOperations.addCard(card)) ? {
            title:  CCommon.ON_SUCCESS,
            body:   "Card " + card.gameID + " created",
        } : {
            title:  CCommon.ON_ERROR,
            body:   CServer.CARD_EXISTING,
        };
    }

    private isMessage(result: Buffer | Message): result is Message {
        return  (result as Message).body    !== undefined &&
                (result as Message).title   !== undefined;
    }

    private generateId(initialId: number): number {
        const list: ICardsIds = this.imageManagerService.getCardsIds();
        const chosenId: number = (initialId !== INITIAL_2D_ID) ? list.index3D++ : list.index2D++;

        this.imageManagerService.saveCardsIds(list);

        return chosenId;
    }

    public isSceneNameNew(title: string): boolean {
        const cards:    ICardLists = this.getCards();

        return !cards.list3D.some((card: ICard): boolean => {
            return card.title === title;
        });
    }

    public getCards(): ICardLists {
        const cardsIds: ICardsIds = this.imageManagerService.getCardsIds();
        const list2D: ICard[] = [];
        const list3D: ICard[] = [];

        cardsIds.descriptions.forEach((description: ICardDescription) => {
            if (description.gamemode === GameMode.simple) {
                const foundCard: ICard = this.imageManagerService.getCardById(description.id.toString(), description.gamemode);
                list2D.push(foundCard);
            } else if (description.gamemode === GameMode.free) {
                const foundCard: ICard = this.imageManagerService.getCardById(description.id.toString(), description.gamemode);
                list3D.push(foundCard);
            }
        });

        return {list2D, list3D};
    }

    private generateErrorMessage(error: Error): Message {
        const isTypeError:  boolean = error instanceof TypeError;
        const errorMessage: string  = isTypeError ? error.message : CServer.UNKNOWN_ERROR;

        return {
            title:  CCommon.ON_ERROR,
            body:   errorMessage,
        };
    }

    private validateCardTitle(cardTitle: string): Message {

        if (!this.titleIsValid(cardTitle)) {
            return this.buildValidatorMessage(CCommon.ON_ERROR, CServer.GAME_FORMAT_LENTGH_ERROR);
        }

        if (this.formatIsValid(cardTitle)) {
            return this.buildValidatorMessage(CCommon.ON_ERROR, CServer.GAME_NAME_ERROR);
        }

        return this.buildValidatorMessage(CCommon.ON_SUCCESS, CServer.GAME_TITLE_IS_CORRECT);
    }

    private titleIsValid(cardTitle: string): boolean {
        return !(cardTitle.length < CCommon.MIN_GAME_LENGTH || cardTitle.length > CCommon.MAX_GAME_LENGTH);
    }

    private formatIsValid(cardTitle: string): boolean {
        const regex: RegExp = new RegExp(CCommon.REGEX_PATTERN_ALPHANUM);

        return !regex.test(cardTitle);
    }

    private buildValidatorMessage(title: string, body: string): Message {
        return {
            title:  title,
            body:   body,
        };
    }
}
