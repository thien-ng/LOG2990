import { Injectable } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";
import { BasicService } from "../basic.service";
import { Message } from "../../../../common/communication/message";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted: boolean | null = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Injectable({
  providedIn: "root",
})
export class LoginValidatorService {

  public MIN_LENGTH: number = 4;
  public MAX_LENGTH: number = 15;
  public REGEX_PATTERN: string = "^[a-zA-Z0-9]+$";
  
  public _matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  public _usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(this.REGEX_PATTERN),
    Validators.minLength(this.MIN_LENGTH),
    Validators.maxLength(this.MAX_LENGTH),
  ]);

  private _messageTitle: Message = {
    title: "",
    body: "",
  };
  private _nameIsUsed: Boolean = false;

  constructor(private _basicService: BasicService){
    // default constructor
  }

  public addUsername(): void {
    let messageServer: Message ={
      title:"test",
      body: this._usernameFormControl.value,
    };
    if (this._usernameFormControl.errors == null){
        this._basicService.basicPost(messageServer).subscribe((message) => {
          this._messageTitle.title = message.title;
          this._messageTitle.body = message.body;
        });
    }
    this._nameIsUsed = (this._messageTitle.body == "false")? true : false;
    if(this._messageTitle.body == "false"){
      
      alert("name already exist");
    }
  }

  public getNameIsUsed(): Boolean{
    return this._nameIsUsed;
  }

}
