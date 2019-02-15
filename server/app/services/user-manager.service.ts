import { injectable } from "inversify";
import { User } from "../../../../common/communication/iUser";

@injectable()
export class UserManagerService {

    private nameList: User[];

    public constructor() {
        this.nameList = [];
    }

    public get usernameList(): User[] {
        return this.nameList;
    }

    public validateName(user: User): Boolean {

        if (this.isUnique(user.username)) {
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
