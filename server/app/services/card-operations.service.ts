import { inject, injectable } from "inversify";
import { DefaultCard2D, DefaultCard3D, DefaultCard3DTheme, GameMode, ICard } from "../../../common/communication/iCard";
import { ICardsIds, ICardDescription } from "../../../common/communication/iCardLists";
import { Message } from "../../../common/communication/message";
import { CCommon } from "../../../common/constantes/cCommon";
import { CServer } from "../CServer";
import Types from "../types";
import { AssetManagerService } from "./asset-manager.service";
import { HighscoreService } from "./highscore.service";

@injectable()
export class CardOperations {

    private imageManagerService:    AssetManagerService;
    private socketServer:           SocketIO.Server;

    public constructor(@inject(Types.HighscoreService) private highscoreService: HighscoreService) {
        this.imageManagerService = new AssetManagerService();
    }

    public setServer(server: SocketIO.Server): void {
        this.socketServer = server;
    }

    public addCard(card: ICard): boolean {
        let isExisting: boolean = false;

        if (this.cardEqual(card)) {
            isExisting = true;
        }

        if (!isExisting) {
            this.imageManagerService.saveCard(card);
            this.addCardId(card);
            this.highscoreService.generateNewHighscore(card.gameID);

            if (this.socketServer) {
                this.socketServer.emit(CCommon.ON_CARD_CREATED);
            }
        }

        return !isExisting;
    }

    public removeCard2D(id: number): string {
        if (id === CServer.DEFAULT_CARD_2D) {
            return CServer.DELETION_ERROR_MESSAGE;
        }

        if (!this.cardExist(id)) {
            return CServer.CARD_NOT_FOUND;
        }

        const paths: string[] = [
            CServer.IMAGES_PATH + "/"       + id + CServer.GENERATED_FILE,
            CServer.IMAGES_PATH + "/"       + id + CCommon.ORIGINAL_FILE,
            CServer.IMAGES_PATH + "/"       + id + CCommon.MODIFIED_FILE,
            CServer.PATH_LOCAL_CARDS        + id + CServer.SIMPLE_CARD_FILE,
            CServer.PATH_LOCAL_HIGHSCORE    + id + CServer.HIGHSCORE_FILE,
        ];

        try {
            this.imageManagerService.deleteStoredImages(paths);
            this.removeCardId(id);
        } catch (error) {
            return this.generateErrorMessage(error).body;
        }
        if (this.socketServer) {
            this.socketServer.emit(CCommon.ON_CARD_DELETED);
        }

        return CServer.CARD_DELETED;
    }

    public removeCard3D(id: number): string {
        if (id === CServer.DEFAULT_CARD_3D_GEO || id === CServer.DEFAULT_CARD_3D_THEME) {
            return CServer.DELETION_ERROR_MESSAGE;
        }
        if (!this.cardExist(id)) {
            return CServer.CARD_NOT_FOUND;
        }

        const paths: string[] = [
            CServer.IMAGES_PATH   + "/"     + id + CServer.GENERATED_SNAPSHOT,
            CServer.SCENE_PATH    + "/"     + id + CCommon.SCENE_FILE,
            CServer.PATH_LOCAL_CARDS        + id + CServer.FREE_CARD_FILE,
            CServer.PATH_LOCAL_HIGHSCORE    + id + CServer.HIGHSCORE_FILE,
        ];

        try {
            this.imageManagerService.deleteStoredImages(paths);
            this.removeCardId(id);
        } catch (error) {
            return this.generateErrorMessage(error).body;
        }
        if (this.socketServer) {
            this.socketServer.emit(CCommon.ON_CARD_DELETED);
        }

        return CServer.CARD_DELETED;
    }

    public removeDefaultGame(): string {
        const paths: string[] = [
            CServer.PATH_LOCAL_CARDS + "1" + CServer.SIMPLE_CARD_FILE,
            CServer.PATH_LOCAL_CARDS + "2" + CServer.FREE_CARD_FILE,
            CServer.PATH_LOCAL_CARDS + "3" + CServer.FREE_CARD_FILE,
        ];
        try {
            this.imageManagerService.deleteStoredImages(paths);
            this.removeCardId(DefaultCard2D.gameID);
            this.removeCardId(DefaultCard3D.gameID);
            this.removeCardId(DefaultCard3DTheme.gameID);
        } catch (error) {
            return this.generateErrorMessage(error).body;
        }

        return CServer.CARD_DELETED;
    }

    public getCardById(id: string, gamemode: GameMode): ICard {
        return this.imageManagerService.getCardById(id, gamemode);
    }

    private getCardsIds(): ICardsIds {
        return this.imageManagerService.getCardsIds();
    }

    private cardEqual(card: ICard): boolean {
        const cardsIds: ICardsIds = this.getCardsIds();

        const descriptionFound: ICardDescription | undefined = cardsIds.descriptions.find((description: ICardDescription) => {

            return (description.id === card.gameID || description.title === card.title);
        });

        if (descriptionFound && (
            descriptionFound.id === DefaultCard2D.gameID ||
            descriptionFound.id === DefaultCard3D.gameID ||
            descriptionFound.id === DefaultCard3DTheme.gameID)) {
            return false;
        }

        return (descriptionFound) ? true : false;
    }

    private cardExist(id: number): boolean {
        const cardsIds: ICardsIds = this.getCardsIds();
        const descriptionFound: ICardDescription | undefined = cardsIds.descriptions.find((description: ICardDescription) => {
            return (description.id === id);
        });

        return (descriptionFound) ? true : false;
    }

    private addCardId(card: ICard): void {
        const description: ICardDescription = {
            id: card.gameID,
            title: card.title,
            gamemode: card.gamemode,
        };

        const cardsIds: ICardsIds = this.imageManagerService.getCardsIds();
        cardsIds.descriptions.unshift(description);

        this.imageManagerService.saveCardsIds(cardsIds);
    }

    private removeCardId(id: number): void {
        const cardsIds: ICardsIds = this.getCardsIds();
        const index2D: number = cardsIds.index2D;
        const index3D: number = cardsIds.index3D;
        const newList: ICardDescription[] = cardsIds.descriptions.filter((description: ICardDescription) => {
            return description.id !== id;
        });

        this.imageManagerService.saveCardsIds({descriptions: newList, index2D: index2D, index3D: index3D});
    }

    public generateErrorMessage(error: Error): Message {
        const isTypeError:  boolean = error instanceof TypeError;
        const errorMessage: string  = isTypeError ? error.message : CServer.UNKNOWN_ERROR;

        return {
            title:  CCommon.ON_ERROR,
            body:   errorMessage,
        };
    }
}
