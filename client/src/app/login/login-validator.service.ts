import { Injectable } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";
import { BasicService } from "../basic.service";

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

  public _usernames: string[] = [];
  
  public _matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  public usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(this.REGEX_PATTERN),
    Validators.minLength(this.MIN_LENGTH),
    Validators.maxLength(this.MAX_LENGTH),
  ]);

  constructor(private _basicService: BasicService){}
  
  // private _basicService: BasicService = new BasicService();

  public addUsername(): void {
    console.log("button is pressed");
    if (this.usernameFormControl.errors == null){
      console.log(this._basicService);
      let temp = this._basicService.basicPost();
      console.log(temp);
    }
    console.log("end");
  }
}
