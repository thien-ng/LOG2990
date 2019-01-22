import { Message } from "../../../common/communication/message";

export class NameValidatorService{

    private  NOT_FOUND_VALUE = -1;

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

    public leaveBrowser(nameRequest: String): Boolean {

        if(this.isInArray(nameRequest)){
            this._nameList = this._nameList.filter( (element) => element != nameRequest);
            return !this.isInArray(nameRequest);
        }
        else {
            return false;
        }
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

    private isInArray(nameRequest: String): Boolean{
        return this._nameList.indexOf(nameRequest) > this.NOT_FOUND_VALUE;
    }

}