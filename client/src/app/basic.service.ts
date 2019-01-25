import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Message } from "../../../common/communication/message";

const HTTP_OPTIONS: {headers: HttpHeaders} = {
  headers: new HttpHeaders({
    "Content-Type":  "application/json",
    "Authorization": "my-auth-token",
  }),
};

@Injectable()
export class BasicService {

    private readonly BASE_URL: string = "http://localhost:3000";

    public constructor(private _http: HttpClient) { }

    public basicGet(): Observable<Message> {

        return this._http.get<Message>(this.BASE_URL + "/api/index").pipe(
            catchError(this.handleError<Message>("basicGet")),
        );
    }

    public basicPost(message: Message, extension: String): Observable<Message> {
        return this._http.post<Message>(
            this.BASE_URL + "/api/index/" + extension,
            message,
            HTTP_OPTIONS)
           .pipe(
                catchError(this.handleError("basicPost", message)),
            );
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
