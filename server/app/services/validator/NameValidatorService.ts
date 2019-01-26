import { injectable } from "inversify";

@injectable()
export class NameValidatorService {

    private _nameList: String[];

    public constructor() {
        this._nameList = [];
    }

    public getNameList(): String[] {
        return this._nameList;
    }

    public validateName(nameRequest: String): Boolean {

        if (this.isUnique(nameRequest)) {
            this._nameList.push(nameRequest);

            return true;
        }

        return false;
    }

    public leaveBrowser(nameRequest: String): void {
        this._nameList = this._nameList.filter( (element: String) => element !== nameRequest);
    }

    public isUnique(nameRequest: String): Boolean {
        let isUniqueElement: Boolean = true;
        this._nameList.forEach( (element: String) => {
            if (element == nameRequest) {
                isUniqueElement = false;
            }
        });

        return isUniqueElement;
    }

}
