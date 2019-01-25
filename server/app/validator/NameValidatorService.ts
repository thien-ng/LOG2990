import { injectable } from "inversify";

@injectable()
export class NameValidatorService{

    // private  NOT_FOUND_VALUE = -1;

    private _nameList: String[]

    constructor(){
        this._nameList = [];
    }

    public validateName(nameRequest: String): Boolean {
        console.log("enter validate name");
        if(this.isUnique(nameRequest)){
            this._nameList.push(nameRequest);
            console.log(this._nameList);
            return true;
        }
        console.log(this._nameList);
        return false;
    }

    public leaveBrowser(nameRequest: String): void {
        console.log("enter leave browser");
        this._nameList = this._nameList.filter( (element) => element !== nameRequest);
        console.log(this._nameList);

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

    // private isInArray(nameRequest: String): Boolean{
    //     return this._nameList.indexOf(nameRequest) > this.NOT_FOUND_VALUE;
    // }

}