import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

const HTTP_OPTION = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    //'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: "root",
})
export class LoginValidatorService {

  private _configUrl : string = "http://localhost:3000/";

  public constructor(private _httpClient : HttpClient) { /* default constructor */ }

  public addUsername(username : String): void {
    // if (this.usernameFormControl.value) {
    //   this.usernames.push(this.usernameFormControl.value);
    // }
    if(username){
      console.log("it wokred");
      this._httpClient.post(this._configUrl, "{hello}", HTTP_OPTION);
    }
    
    console.log("it still wokred");
  }

}
