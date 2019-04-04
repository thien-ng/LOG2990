import { AxiosInstance } from "axios";
import { injectable } from "inversify";
import { IUser } from "../../../common/communication/iUser";
import { Message } from "../../../common/communication/message";
import { CCommon } from "../../../common/constantes/cCommon";
import { CServer } from "../CServer";
import { AssetManagerService } from "./asset-manager.service";

const axios:                AxiosInstance = require("axios");
const IMAGE_EXTENSION:      string        = ".bmp";

@injectable()
export class UserManagerService {

    private nameList:       IUser[];
    private assetManager:   AssetManagerService;

    public constructor() {
        this.nameList       = [];
        this.assetManager   = new AssetManagerService();
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

    public async validateName(username: string): Promise<Message> {

        const validationResult: Message = this.isUsernameFormatCorrect(username);
        if (validationResult.title !== CCommon.ON_SUCCESS) {
            return validationResult;
        }

        if (this.isUnique(username)) {
            const user: IUser = {
                username:   username,
                socketID:   "undefined",
            };
            this.nameList.push(user);

            try {
                await this.createUserPic(username);
            } catch (error) {
                return this.generateMessage(CCommon.ON_ERROR, error.message);
            }

            return this.generateMessage(CCommon.ON_SUCCESS, CCommon.IS_UNIQUE);
        }

        return this.generateMessage(CCommon.ON_SUCCESS, CServer.NOT_UNIQUE_NAME);
    }

    private async createUserPic(username: string): Promise<void> {
        const picBuffer: Buffer = (await axios.get(CServer.PROFILE_PIC_GEN_PATH)).data;
        const path: string = CServer.PROFILE_IMAGE_PATH + username + IMAGE_EXTENSION;
        this.assetManager.stockImage(path, picBuffer);
    }

    public getUserByUsername(username: string): IUser | string {
        const foundUser: IUser =  this.users.filter((user: IUser) => {
            return user.username === username;
        })[0];

        return (foundUser) ? foundUser : CServer.USER_NOT_FOUND;
    }

    public leaveBrowser(user: IUser): void {
        this.nameList = this.nameList.filter( (element: IUser) => element.username !== user.username);
        const path: string = CServer.PROFILE_IMAGE_PATH + user.username + IMAGE_EXTENSION;
        try {
            this.assetManager.deleteStoredImages([path]);
        } catch (error) {
            // _TODO faire quelque chose de cette erreur (throw fait crash le server)
        }
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

    private isUsernameFormatCorrect(username: string): Message {

        const regex: RegExp = new RegExp(CCommon.REGEX_PATTERN_ALPHANUM);

        if (username.length < CCommon.MIN_NAME_LENGTH || username.length > CCommon.MAX_NAME_LENGTH) {
            return this.generateMessage(CCommon.ON_ERROR, CServer.NAME_FORMAT_LENGTH_ERROR);
        }

        if (!regex.test(username)) {
            return this.generateMessage(CCommon.ON_ERROR, CServer.USER_NAME_ERROR);
        }

        return this.generateMessage(CCommon.ON_SUCCESS, CCommon.ON_SUCCESS);
    }

    private generateMessage(type: string, result: string): Message {
        return {
            title:  type,
            body:   result,
        } as Message;
    }
}
