import { inject, injectable } from "inversify";
import { GameMode, ICard } from "../../../common/communication/iCard";
import { ICardLists } from "../../../common/communication/iCardLists";
import { Message } from "../../../common/communication/message";
import { Constants } from "../constants";
import Types from "../types";
import { AssetManagerService } from "./asset-manager.service";
import { HighscoreService } from "./highscore.service";

@injectable()
export class CardOperations {

    private imageManagerService: AssetManagerService;
    private cards: ICardLists;

    public constructor(@inject(Types.HighscoreService) private highscoreService: HighscoreService) {
        this.imageManagerService = new AssetManagerService();
        this.cards = {
            list2D: [],
            list3D: [],
        };
    }

    public getCardList(): ICardLists {
        return this.cards;
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

    public removeCard2D(id: number): string {
        if (id === Constants.DEFAULT_CARD_ID) {
            return Constants.DELETION_ERROR_MESSAGE;
        }
        const index: number = this.findCard2D(id);
        const paths: string[] = [
                                    Constants.IMAGES_PATH + "/" + id + Constants.GENERATED_FILE,
                                    Constants.IMAGES_PATH + "/" + id + Constants.ORIGINAL_FILE,
                                    Constants.IMAGES_PATH + "/" + id + Constants.MODIFIED_FILE,
                                ];
        if (index === Constants.DOESNT_EXIST) {
            return Constants.CARD_NOT_FOUND;
        }

        try {
            this.imageManagerService.deleteStoredImages(paths);
            this.cards.list2D.splice(index, 1);
        } catch (error) {
            return this.generateErrorMessage(error).body;
        }

        return Constants.CARD_DELETED;
    }

    public removeCard3D(id: number): string {
        if (id === Constants.DEFAULT_CARD_ID) {
            return Constants.DELETION_ERROR_MESSAGE;
        }
        const index: number = this.findCard3D(id);
        if (index === Constants.DOESNT_EXIST) {
            return Constants.CARD_NOT_FOUND;
        }

        const paths: string[] = [
            Constants.IMAGES_PATH + "/" + id + Constants.GENERATED_SNAPSHOT,
            Constants.SCENE_PATH + "/" + id + Constants.SCENES_FILE,
        ];
        try {
            this.imageManagerService.deleteStoredImages(paths);
            this.cards.list3D.splice(index, 1);
        } catch (error) {
            return this.generateErrorMessage(error).body;
        }

        return Constants.CARD_DELETED;
    }

    public getCardById(id: string, gamemode: GameMode): ICard {
        const cardID: number = parseInt(id, Constants.DECIMAL);
        const index: number = (gamemode === GameMode.simple) ? this.findCard2D(cardID) : this.findCard3D(cardID);

        return (gamemode === GameMode.simple) ? this.cards.list2D[index] : this.cards.list3D[index];
    }

    private findCard2D(id: number): number {
        let index: number = Constants.DOESNT_EXIST;
        this.cards.list2D.forEach((card: ICard) => {
                if (card.gameID === id) {
                    index = this.cards.list2D.indexOf(card);
                }
        });

        return index;
    }

    private findCard3D(id: number): number {
        let index: number = Constants.DOESNT_EXIST;
        this.cards.list3D.forEach((card: ICard) => {
                if (card.gameID === id) {
                    index = this.cards.list3D.indexOf(card);
                }
        });

        return index;
    }

    private cardEqual(card: ICard, element: ICard): boolean {
        return (element.gameID === card.gameID ||
                element.title === card.title);
    }

    public generateErrorMessage(error: Error): Message {
        const isTypeError: boolean = error instanceof TypeError;
        const errorMessage: string = isTypeError ? error.message : Constants.UNKNOWN_ERROR;

        return {
            title: Constants.ON_ERROR_MESSAGE,
            body: errorMessage,
        };
    }
}
