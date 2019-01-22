import { Message } from "../../../common/communication/message";

export class NameValidatorService{

    constructor(private _nameList: String[]){
        //default constructor
    }

    public validateName(nameRequest: String): Boolean {
        if(isUnique(nameRequest)){
            this._nameList.push(nameRequest);
            
            return true;
        }
        else{
            return false;
        }
    }

    public leaveBrowser(nameRequest: String): Boolean {

    }

    private isUnique(nameRequest: String): Boolean { 
        return !this._nameList.includes(nameRequest);
    }





}