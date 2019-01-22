import { Message } from "../../../common/communication/message";

export class NameValidatorService{

    private _nameList: String[]

    constructor(){
        this._nameList = [];
    }

    public validateName(nameRequest: Message): Boolean {

        if(this.isUnique(nameRequest.body)){
            this._nameList.push(nameRequest.body);
            return true;
        }
        return false;
    }

    private isUnique(nameRequest: String): Boolean { 
        //check if tsconfig works
    //     return !this._nameList.include(nameRequest);
        let isUniqueElement: Boolean = true;
        this._nameList.forEach( (element) => {
            if(element === nameRequest){
                isUniqueElement = false;
            }
        });
        return isUniqueElement;
    }

    public leaveBrowser(nameRequest: String): Boolean {

        this._nameList = this._nameList.filter( (element) => element != nameRequest);

        return true;
    }

}