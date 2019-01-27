import { injectable } from "inversify";
import { CardModel, GameMode } from "../../../common/communication/cardModel";
import { CardObject } from "../utilitaries/card-object";

const INDEX_2D: number = 0;
const INDEX_3D: number = 1;
const DOESNT_EXIST: number = -1;
const GAME_MODE_INDEX: number = 0;
const CARD_POS_INDEX: number = 1;

@injectable()
export class CardManagerService {
    private _cards: CardObject[][] = [
        [
            new CardObject({
                gameID: 1,
                title: "Default 2D",
                subtitle: "default 2D",
                avatarImageUrl: "../asset/image/elon.jpg",
                gameImageUrl: "../asset/image/elon.jpg",
                gamemode: GameMode.twoD,
            }),
        ],
        [
            new CardObject({
                gameID: 2,
                title: "Default 3D",
                subtitle: "default 3D",
                avatarImageUrl: "../asset/image/moutain.jpg",
                gameImageUrl: "../asset/image/moutain.jpg",
                gamemode: GameMode.threeD,
            }),
        ],
        ];

    private cardEqual(card: CardObject, element: CardObject): boolean {
        return (element.cardModel.gameID === card.cardModel.gameID &&
                element.cardModel.gameImageUrl === card.cardModel.gameImageUrl &&
                element.cardModel.title === card.cardModel.title);
    }

    public addCard(card: CardObject): boolean {
        const index: number = card.cardModel.gamemode;
        let isExisting: boolean = false;
        this._cards[index].forEach((element: CardObject) => {
            if (this.cardEqual(card, element)) {
                isExisting = true;
            }
        });

        if (!isExisting) {
            this._cards[index].push(card);
        }

        return !isExisting;
    }

    public getCards(): CardModel[][] {
        const cardModels: CardModel[][] = [[], []];
        this._cards[INDEX_2D].forEach((element: CardObject) => {
            cardModels[INDEX_2D].push(element.cardModel);
        });
        this._cards[INDEX_3D].forEach((element: CardObject) => {
            cardModels[INDEX_3D].push(element.cardModel);
        });

        return cardModels;
    }

    public findCard(id: number): [number, number] {
        let indexs: [number, number] = [DOESNT_EXIST, DOESNT_EXIST];
        this._cards.forEach((cards: CardObject[]) => {
            cards.forEach((card: CardObject) => {
                if (card.cardModel.gameID === id) {

                    indexs = [this._cards.indexOf(cards), cards.indexOf(card)];
                }
            });
        });

        return indexs;
    }

    public removeCard(id: number): boolean {
        const indexs: [number, number] = this.findCard(id);
        if (indexs[GAME_MODE_INDEX] !== DOESNT_EXIST) {
            this._cards[indexs[GAME_MODE_INDEX]].splice(indexs[CARD_POS_INDEX], 1);

            return true;
        }

        return false;
    }
}
