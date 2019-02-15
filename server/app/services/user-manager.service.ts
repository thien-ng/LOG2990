import { injectable } from "inversify";
import { User } from "../../../common/communication/iUser";
// import { Message } from "../../../common/communication/message";
// import { Constants } from "../constants";

// const USERNAME_ERROR: string = "Aucun utilisateur n'est associé au socket ID";

@injectable()
export class UserManagerService {

    private nameList: User[];

    public constructor() {
        this.nameList = [];
    }

    public get users(): User[] {
        return this.nameList;
    }

    public updateSocketID(updateUser: User): void {
        this.nameList.some((user: User): boolean => {
            if (user.socketID === updateUser.socketID) {
                user.username = updateUser.username;

                return true;
            } else if (user.username === updateUser.username) {
                user.socketID = updateUser.socketID;
            }

            return false;
        });

        this.nameList = this.nameList.filter((user: User) => {
            return user.socketID !== "undefined";
        });
    }

    public validateName(username: string): Boolean {

        if (this.isUnique(username)) {
            const user: User = {
                username: username,
                socketID: "undefined",
            };
            this.nameList.push(user);

            return true;
        }

        return false;
    }

    public leaveBrowser(user: User): void {
        this.nameList = this.nameList.filter( (element: User) => element.username !== user.username);
    }

    public isUnique(nameRequest: String): Boolean {
        let isUniqueElement: Boolean = true;
        this.nameList.forEach( (element: User) => {
            if (element.username === nameRequest) {
                isUniqueElement = false;
            }
        });

        return isUniqueElement;
    }

}
