import { injectable } from "inversify";
import { Constants } from "../../../client/src/app/constants";
import { GameMode, ICard } from "../../../common/communication/iCard";
import { ICardLists } from "../../../common/communication/iCardLists";

const DOESNT_EXIST: number = -1;
const CARD_DELETED: string = "Carte suprimée";
const CARD_NOT_FOUND: string = "Erreur de suppression, carte pas trouvée";

@injectable()
export class CardManagerService {
    private cards: ICardLists = {
        list2D: [
            {
                gameID: 1,
                title: "Default 2D",
                subtitle: "default 2D",
                avatarImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/api/asset/image/elon.jpg",
                gameImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/api/asset/image/elon.jpg",
                gamemode: GameMode.simple,
            },
        ],
        list3D: [
            {
                gameID: 2,
                title: "Default 3D",
                subtitle: "default 3D",
                avatarImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/api/asset/image/moutain.jpg",
                gameImageUrl: Constants.BASIC_SERVICE_BASE_URL + "/api/asset/image/moutain.jpg",
                gamemode: GameMode.free,
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
        this.cards.list2D.forEach((element: ICard) => {
            if (this.cardEqual(card, element)) {
                isExisting = true;
            }
        });
        if (!isExisting) {
            this.cards.list2D.push(card);
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
