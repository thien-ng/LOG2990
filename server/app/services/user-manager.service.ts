import { injectable } from "inversify";
import { User } from "../../../common/communication/iUser";
import { Message } from "../../../common/communication/message";
import { Constants } from "../constants";

@injectable()
export class UserManagerService {

    private nameList: User[];

    public constructor() {
        this.nameList = [];
    }

    public get users(): User[] {
        return this.nameList;
    }

    public updateSocketID(newUserInfo: User): void {
        this.nameList.some((user: User): boolean => {
            if (user.socketID === newUserInfo.socketID) {
                user.username = newUserInfo.username;

                return true;
            } else if (user.username === newUserInfo.username) {
                user.socketID = newUserInfo.socketID;
            }

            return false;
        });

        this.nameList = this.nameList.filter((user: User) => {
            return user.socketID !== "undefined";
        });
    }

    public validateName(username: string): Message {

        const validationResult: Message = this.isUsernameFormatCorrect(username);
        if (validationResult.title !== Constants.SUCCESS_TITLE) {
            return validationResult;
        }

        if (this.isUnique(username)) {
            const user: User = {
                username: username,
                socketID: "undefined",
            };
            this.nameList.push(user);

            return this.generateMessage(Constants.UNIQUE_NAME, Constants.SUCCESS_TITLE);
        }

        return this.generateMessage(Constants.NOT_UNIQUE_NAME, Constants.SUCCESS_TITLE);
    }

    public getUserByUsername(username: string): User | string {
        const foundUser: User =  this.users.filter((user: User) => {
            return user.username === username;
        })[0];

        return (foundUser) ? foundUser : Constants.USER_NOT_FOUND;
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

    private isUsernameFormatCorrect(username: string): Message {

        const regex: RegExp = new RegExp(Constants.REGEX_FORMAT);

        if (username.length < Constants.MIN_VALUE || username.length > Constants.MAX_VALUE) {
            return this.generateMessage(Constants.NAME_FORMAT_LENTGH_ERROR, Constants.ERROR_TITLE);
        }

        if (!regex.test(username)) {
            return this.generateMessage(Constants.NAME_FORMAT_REGEX_ERROR, Constants.ERROR_TITLE);
        }

        return this.generateMessage(Constants.SUCCESS_TITLE, Constants.SUCCESS_TITLE);
    }

    private generateMessage(result: string, type: string): Message {

        return {
            title: type,
            body: result,
        } as Message;
    }

}
