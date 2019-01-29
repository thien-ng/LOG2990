import { injectable } from "inversify";
import { Constants } from "../../../client/src/app/constants";
import { CardMessage } from "../../../common/communication/card-message";
import { GameMode, ICard } from "../../../common/communication/iCard";
import { ICardLists } from "../../../common/communication/iCardLists";

const DOESNT_EXIST: number = -1;

@injectable()
export class CardManagerService {
    private _cards: ICardLists = {
        list2D: [
            {
                gameID: 1,
                title: "Default 2D",
                subtitle: "default 2D",
                avatarImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/api/asset/image/elon.jpg",
                gameImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/api/asset/image/elon.jpg",
                gamemode: GameMode.twoD,
            },
        ],
        list3D: [
            {
                gameID: 2,
                title: "Default 3D",
                subtitle: "default 3D",
                avatarImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/api/asset/image/moutain.jpg",
                gameImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/api/asset/image/moutain.jpg",
                gamemode: GameMode.threeD,
            },
        ],
    };

    private cardEqual(card: ICard, element: ICard): boolean {
        return (element.gameID === card.gameID &&
                element.gameImageUrl === card.gameImageUrl &&
                element.title === card.title);
    }

    public addCard2D(card: ICard): boolean {
        let isExisting: boolean = false;
        this._cards.list2D.forEach((element: ICard) => {
            if (this.cardEqual(card, element)) {
                isExisting = true;
            }
        });
        if (!isExisting) {
            this._cards.list2D.push(card);
        }

        return !isExisting;
    }

    public addCard3D(card: ICard): boolean {
        let isExisting: boolean = false;
        this._cards.list3D.forEach((element: ICard) => {
            if (this.cardEqual(card, element)) {
                isExisting = true;
            }
        });
        if (!isExisting) {
            this._cards.list3D.push(card);
        }

        return !isExisting;
    }

    public getCards(): ICardLists {
        return this._cards;
    }

    private findCard2D(id: number): number {
        let index: number = DOESNT_EXIST;
        this._cards.list2D.forEach((card: ICard) => {
                if (card.gameID === id) {
                    index = this._cards.list2D.indexOf(card);
                }
        });

        return index;
    }

    private findCard3D(id: number): number {
        let index: number = DOESNT_EXIST;
        this._cards.list3D.forEach((card: ICard) => {
                if (card.gameID === id) {
                    index = this._cards.list3D.indexOf(card);
                }
        });

        return index;
    }

    public removeCard(obj: CardMessage): boolean {
        if (obj.gameMode === GameMode.twoD) {
            return this.removeCard2D(obj.id);
        } else {
            return this.removeCard3D(obj.id);
        }
    }

    public removeCard2D(id: number): boolean {
        const index: number = this.findCard2D(id);
        if (index !== DOESNT_EXIST) {
            this._cards.list2D.splice(index, 1);

            return true;
        }

        return false;
    }

    public removeCard3D(id: number): boolean {
        const index: number = this.findCard3D(id);
        if (index !== DOESNT_EXIST) {
            this._cards.list3D.splice(index, 1);

            return true;
        }

        return false;
    }
}
