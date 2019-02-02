import * as Axios from "axios";
import * as fs from "fs";
import { inject, injectable } from "inversify";
import { Constants } from "../../../client/src/app/constants";
import { GameMode, ICard } from "../../../common/communication/iCard";
import { ICardLists } from "../../../common/communication/iCardLists";
import { Message } from "../../../common/communication/message";
import Types from "../types";
import { IImageRequirements } from "./difference-checker/utilities/iimageRequirements";
import { HighscoreService } from "./highscore.service";

const axios: Axios.AxiosInstance = require("axios");
const DOESNT_EXIST: number = -1;
const CARD_DELETED: string = "Carte supprimée";
const CARD_NOT_FOUND: string = "Erreur de suppression, carte pas trouvée";
const REQUIRED_HEIGHT: number = 480;
const REQUIRED_WIDTH: number = 640;
const REQUIRED_NB_DIFF: number = 7;

@injectable()
export class CardManagerService {
    private cards: ICardLists = {
        list2D: [],
        list3D: [],
    };

    private uniqueId: number = 1000;

    public constructor(@inject(Types.HighscoreService) private highscoreService: HighscoreService) {
        this.addCard2D({
            gameID: 1,
            title: "Default 2D",
            subtitle: "default 2D",
            avatarImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/image/elon.jpg",
            gameImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/image/elon.jpg",
            gamemode: GameMode.simple,
        });
        this.addCard3D({
            gameID: 2,
            title: "Default 3D",
            subtitle: "default 3D",
            avatarImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/image/moutain.jpg",
            gameImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/image/moutain.jpg",
            gamemode: GameMode.free,
        });
    }

    public async cardCreationRoutine(original: Buffer, modified: Buffer): Promise<boolean | Message> {
        const requirements: IImageRequirements = {
                                                    requiredHeight: REQUIRED_HEIGHT,
                                                    requiredWidth: REQUIRED_WIDTH,
                                                    requiredNbDiff: REQUIRED_NB_DIFF,
                                                    originalImage: original,
                                                    modifiedImage: modified,
                                                };

        let returnValue: boolean | Message = false;

        await axios.post(Constants.BASIC_SERVICE_BASE_URL + "/api/differenceChecker/validate", requirements)
        .then((response: Axios.AxiosResponse< Buffer | Message>) => {

            returnValue = this.handlePostResponse(response);
        }).catch((err: Error) => {
            return err.message;
        });

        return returnValue;
    }

    private handlePostResponse(response: Axios.AxiosResponse< Buffer | Message>): boolean | Message {

        const result: Buffer | Message = response.data;
        if (this.isMessage(result)) {
            return result;
        } else {
            // creeate card
            /*const cardId: number = */
            this.createBMP(result);

            return true;
        }
    }

    private createBMP(buffer: Buffer): number {

        const cardId: number = this.generateId();
        const path: string = "./app/asset/image/generated/" + cardId + "_generated.bmp";

        this.stockImage(path, buffer);

        return cardId;
    }

    private isMessage(result: Buffer | Message): result is Message {
        return  (result as Message).body !== undefined &&
                (result as Message).title !== undefined;
    }

    private stockImage(path: string, buffer: Buffer): void {

        //je crois quil faut faire ca, on veut cree et ecrire directement one shot
        console.log(Buffer.from(buffer));
        fs.writeFile(path, Buffer.from(buffer), (error: Error) => {
            if (error) {
                throw TypeError("error while generating file");
            }
        });

    }

    private generateId(): number {
        return this.uniqueId++;
    }

    private cardEqual(card: ICard, element: ICard): boolean {
        return (element.gameID === card.gameID &&
                element.gameImageUrl === card.gameImageUrl &&
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
            this.cards.list2D.push(card);
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
            this.cards.list3D.push(card);
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
        const index: number = this.findCard2D(id);
        if (index !== DOESNT_EXIST) {
            this.cards.list2D.splice(index, 1);

            return CARD_DELETED;
        }

        return CARD_NOT_FOUND;
    }

    public removeCard3D(id: number): string {
        const index: number = this.findCard3D(id);
        if (index !== DOESNT_EXIST) {
            this.cards.list3D.splice(index, 1);

            return CARD_DELETED;
        }

        return CARD_NOT_FOUND;
    }
}
