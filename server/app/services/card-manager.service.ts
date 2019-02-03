import * as Axios from "axios";
import * as fs from "fs";
import { inject, injectable } from "inversify";
import { DefaultCard2D, DefaultCard3D, GameMode, ICard } from "../../../common/communication/iCard";
import { ICardLists } from "../../../common/communication/iCardLists";
import { Message } from "../../../common/communication/message";
import { Constants } from "../constants";
import Types from "../types";
import { ImageRequirements } from "./difference-checker/utilities/imageRequirements";
import { HighscoreService } from "./highscore.service";

const axios: Axios.AxiosInstance = require("axios");
const DOESNT_EXIST: number = -1;
const CARD_DELETED: string = "Carte supprimée";
const CARD_NOT_FOUND: string = "Erreur de suppression, carte pas trouvée";
const REQUIRED_HEIGHT: number = 480;
const REQUIRED_WIDTH: number = 640;
const REQUIRED_NB_DIFF: number = 7;
const IMAGES_PATH: string = "./app/asset/image";
const FILE_GENERATION_ERROR: string = "error while generating file";
const FILE_DELETION_ERROR: string = "error while deleting file";
const DEFAULT_CARD_ID: number = 1;

@injectable()
export class CardManagerService {
    private cards: ICardLists = {
        list2D: [],
        list3D: [],
    };

    private originalImageRequest: Buffer;
    private modifiedImageRequest: Buffer;

    private uniqueId: number = 1000;

    public constructor(@inject(Types.HighscoreService) private highscoreService: HighscoreService) {
        this.addCard2D(DefaultCard2D);
        this.addCard3D(DefaultCard3D);
    }

    public async cardCreationRoutine(original: Buffer, modified: Buffer, cardTitle: string): Promise<Message> {
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
            await axios.post(Constants.BASIC_SERVICE_BASE_URL + "/api/differenceChecker/validate", requirements)
            .then((response: Axios.AxiosResponse< Buffer | Message>) => {
                returnValue = this.handlePostResponse(response, cardTitle);
                },
            );
        } catch (error) {
            return {
                title: Constants.ON_ERROR_MESSAGE,
                body: error.message,
            };
        }

        return returnValue;
    }

    private handlePostResponse(response: Axios.AxiosResponse< Buffer | Message>, cardTitle: string): Message {

        const result: Buffer | Message = response.data;
        if (this.isMessage(result)) {
            return result;
        } else {
            const cardId: number = this.generateId();
            const originalImagePath: string = "/" + cardId + "_original.bmp";
            const modifiedImagePath: string = "/" + cardId + "_modified.bmp";
            this.stockImage(IMAGES_PATH + originalImagePath, this.originalImageRequest);
            this.stockImage(IMAGES_PATH + modifiedImagePath, this.modifiedImageRequest);
            this.createBMP(result, cardId);

            this.addCard2D({
                gameID: cardId,
                title: cardTitle,
                subtitle: cardTitle,
                avatarImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/image" + originalImagePath,
                gameImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/image" + originalImagePath,
                gamemode: GameMode.simple,
            });

            return {
                title: Constants.ON_SUCCESS_MESSAGE,
                body: "Card " + cardId + " created",
            };
        }
    }

    private createBMP(buffer: Buffer, cardId: number): number {

        const path: string = IMAGES_PATH + "/" + cardId + "_generated.bmp";

        this.stockImage(path, buffer);

        return cardId;
    }

    private isMessage(result: Buffer | Message): result is Message {
        return  (result as Message).body !== undefined &&
                (result as Message).title !== undefined;
    }

    private stockImage(path: string, buffer: Buffer): void {
        fs.writeFile(path, Buffer.from(buffer), (error: Error) => {
            if (error) {
                throw TypeError(FILE_GENERATION_ERROR);
            }
        });
    }

    private deleteStoredImages(paths: string[]): void {
        paths.forEach((path: string) => {
            fs.unlink(path, (error: Error) => {
                if (error) {
                    throw TypeError(FILE_DELETION_ERROR);
                }
            });
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
        const paths: string[] = [
                                    IMAGES_PATH + "/" + id + "_generated.bmp",
                                    IMAGES_PATH + "/" + id + "_original.bmp",
                                    IMAGES_PATH + "/" + id + "_modified.bmp",
                                ];
        if (index !== DOESNT_EXIST) {
            this.cards.list2D.splice(index, 1);
            try {
                if (id !== DEFAULT_CARD_ID) {
                    this.deleteStoredImages(paths);
                }
            } catch (error) {
                return error.message;
            }

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
