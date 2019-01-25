// import { injectable } from "inversify";
import { CardModel } from "../../../common/communication/cardModel";
import { CardObject } from "../utilitaries/card-object";

const INDEX_2D: number = 0;
const INDEX_3D: number = 1;
const TWO: number = 2;
const FOUR: number = 4;
const SIX: number = 6;
// @injectable()
export class CardManagerService {
    private _cards2D: CardObject[] = [new CardObject({
        gameID: 1,
        title: "Default 2D",
        subtitle: "default 2D",
        avatarImageUrl: "http://lebaneezgirl11.l.e.pic.centerblog.net/sch1p9t8.jpg",
        gameImageUrl: "http://lebaneezgirl11.l.e.pic.centerblog.net/sch1p9t8.jpg",
        highscore: {
            timesSingle: [TWO, FOUR, SIX],
            timesMulti: [TWO, FOUR, SIX],
        },
       })];

    private _cards3D: CardObject[] = [new CardObject({
        gameID: 2,
        title: "Default 3D",
        subtitle: "default 3D",
        avatarImageUrl: "http://www.humour-canin.com/images/canin/wallpapers/real_3015_husky.jpg",
        gameImageUrl: "http://www.humour-canin.com/images/canin/wallpapers/real_3015_husky.jpg",
        highscore: {
            timesSingle: [TWO, FOUR, SIX],
            timesMulti: [TWO, FOUR, SIX],
        },
       })];

    // public addCard(cards: CardObject): boolean {
    //     _card.forEach(element => {

    //     });

    //     this._cards.push(cards);
    // }

    public getCards(): CardModel[][] {
        const cardModels: CardModel[][] = [[], []];
        this._cards2D.forEach((element: CardObject) => {
            cardModels[INDEX_2D].push(element.cardModel);
        });
        this._cards3D.forEach((element: CardObject) => {
            cardModels[INDEX_3D].push(element.cardModel);
        });

        return cardModels;
    }
}
