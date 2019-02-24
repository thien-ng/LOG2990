import { injectable } from "inversify";
import { IUser } from "../../../common/communication/iUser";
import { Constants } from "../constants";

@injectable()
export class UserManagerService {

    private nameList: IUser[];

    public constructor() {
        this.nameList = [];
    }

    public get users(): IUser[] {
        return this.nameList;
    }

    public updateSocketID(newUserInfo: IUser): void {
        this.nameList.some((user: IUser): boolean => {
            if (user.socketID === newUserInfo.socketID) {
                user.username = newUserInfo.username;

                return true;
            } else if (user.username === newUserInfo.username) {
                user.socketID = newUserInfo.socketID;
            }

            return false;
        });

        this.nameList = this.nameList.filter((user: IUser) => {
            return user.socketID !== "undefined";
        });
    }

    public validateName(username: string): Boolean {

        if (this.isUnique(username)) {
            const user: IUser = {
                username: username,
                socketID: "undefined",
            };
            this.nameList.push(user);

            return true;
        }

        return false;
    }

    public getUserByUsername(username: string): IUser | string {
        const foundUser: IUser =  this.users.filter((user: IUser) => {
            return user.username === username;
        })[0];

        return (foundUser) ? foundUser : Constants.USER_NOT_FOUND;
    }

    public leaveBrowser(user: IUser): void {
        this.nameList = this.nameList.filter( (element: IUser) => element.username !== user.username);
    }

    public isUnique(nameRequest: String): Boolean {
        let isUniqueElement: Boolean = true;
        this.nameList.forEach( (element: IUser) => {
            if (element.username === nameRequest) {
                isUniqueElement = false;
            }
        });

        return isUniqueElement;
    }

}
