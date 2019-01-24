import { Message } from "../../../common/communication/message";

export class NameValidatorService{

    private  NOT_FOUND_VALUE = -1;

    private _nameList: String[]

    constructor(){
        this._nameList = [];
    }

    public validateName(nameRequest: Message): Boolean {
        console.log("enter validate name");
        if(this.isUnique(nameRequest.body)){
            this._nameList.push(nameRequest.body);
            console.log(this._nameList);
            return true;
        }
        console.log(this._nameList);
        return false;
    }

    public leaveBrowser(nameRequest: String): Boolean {
        console.log("enter leave browser");
        if(this.isInArray(nameRequest)){
            this._nameList = this._nameList.filter( (element) => element != nameRequest);
            console.log(this._nameList);
            return !this.isInArray(nameRequest);
        }
        console.log(this._nameList);
        return false;
    }

    public isUnique(nameRequest: String): Boolean { 
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