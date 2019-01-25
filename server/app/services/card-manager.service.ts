import { injectable } from "inversify";
import { CardModel } from "../../../common/communication/cardModel";
import { CardObject } from "../utilitaries/card-object";

const INDEX_2D: number = 0;
const INDEX_3D: number = 1;
const TWO: number = 2;
const FOUR: number = 4;
const SIX: number = 6;

@injectable()
export class CardManagerService {
    private _cards: CardObject[][] = [
        [
            new CardObject({
                gameID: 1,
                title: "Default 2D",
                subtitle: "default 2D",
                avatarImageUrl: "http://lebaneezgirl11.l.e.pic.centerblog.net/sch1p9t8.jpg",
                gameImageUrl: "http://lebaneezgirl11.l.e.pic.centerblog.net/sch1p9t8.jpg",
                is2D: true,
                highscore: {
                    timesSingle: [TWO, FOUR, SIX],
                    timesMulti: [TWO, FOUR, SIX],
                },
            }),
        ],
        [
            new CardObject({
                gameID: 2,
                title: "Default 3D",
                subtitle: "default 3D",
                avatarImageUrl: "http://www.humour-canin.com/images/canin/wallpapers/real_3015_husky.jpg",
                gameImageUrl: "http://www.humour-canin.com/images/canin/wallpapers/real_3015_husky.jpg",
                is2D: false,
                highscore: {
                    timesSingle: [TWO, FOUR, SIX],
                    timesMulti: [TWO, FOUR, SIX],
                },
            }),
        ],
        ];

    private cardEqual(card: CardObject, element: CardObject): boolean {
        return (element.cardModel.gameID === card.cardModel.gameID &&
                element.cardModel.gameImageUrl === card.cardModel.gameImageUrl &&
                element.cardModel.title === card.cardModel.title);
    }

    public addCard(card: CardObject): boolean {
        const index: number = card.cardModel.is2D ? INDEX_2D : INDEX_3D;
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
        this._cards[0].forEach((element: CardObject) => {
            cardModels[INDEX_2D].push(element.cardModel);
        });
        this._cards[1].forEach((element: CardObject) => {
            cardModels[INDEX_3D].push(element.cardModel);
        });

        return cardModels;
    }
}
