import { injectable } from "inversify";

@injectable()
export class NameValidatorService {

    private nameList: String[];

    public constructor() {
        this.nameList = [];
    }

    public getNameList(): String[] {
        return this.nameList;
    }

    public validateName(nameRequest: String): Boolean {

        if (this.isUnique(nameRequest)) {
            this.nameList.push(nameRequest);
     
            return true;
        }

        return false;
    }

    public leaveBrowser(nameRequest: String): void {
        this.nameList = this.nameList.filter( (element: String) => element !== nameRequest);
    }

    public isUnique(nameRequest: String): Boolean {
        let isUniqueElement: Boolean = true;
        this.nameList.forEach( (element: String) => {
            if (element === nameRequest) {
                isUniqueElement = false;
            }
        });

        return isUniqueElement;
    }

}
