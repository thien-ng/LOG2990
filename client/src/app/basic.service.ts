import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Message } from "../../../common/communication/message";

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class BasicService {

    private readonly BASE_URL: string = "http://localhost:3000/";

    public constructor(private _http: HttpClient) { }

    public basicGet(): Observable<Message> {

        return this._http.get<Message>(this.BASE_URL).pipe(
            catchError(this.handleError<Message>("basicGet")),
        );
    }

    public basicPost(): Observable<Message> {

        let tempMessage: Message = {
            title: "test",
            body: "testBody",
        };
        console.log("basicpost");
        //return this._http.post<Message>(this.BASE_URL+"/api/index/service/validator/validate-name", tempMessage, HTTP_OPTIONS)
        return this._http.post<Message>("http://localhost:3000/api/index/service/validator/validate-name", tempMessage, HTTP_OPTIONS)
           .pipe(
                catchError(this.handleError('basicPost', tempMessage))
            );
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
