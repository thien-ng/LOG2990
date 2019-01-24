import { Injectable } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";
import { BasicService } from "../basic.service";
import { Message } from "../../../../common/communication/message";
import { Router } from "@angular/router";

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

  constructor(private _basicService: BasicService, private _router: Router){
    // default constructor
  }

  public addUsername(): void {
    let messageServer: Message ={
      title:"test",
      body: this._usernameFormControl.value,
    };
    if (this._usernameFormControl.errors == null){
        this._basicService.basicPost(
          messageServer,
          "service/validator/validate-name"
          ).subscribe((message) => {

          this._messageTitle.title = message.title;
          this._messageTitle.body = message.body;
        });
    }
    if(this._messageTitle.body == "true"){
      this._router.navigate(["gamelist"]);
    
    }
    else{
      alert("name already exist");
    }
  }

}
