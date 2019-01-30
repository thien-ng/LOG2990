import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { Constants } from "./constants";

import { Message } from "../../../common/communication/message";

const HTTP_OPTIONS: {headers: HttpHeaders} = {
  headers: new HttpHeaders({
    "Content-Type":  "application/json",
    "Authorization": "my-auth-token",
  }),
};

@Injectable()
export class BasicService {

    public constructor(private http: HttpClient) { }

    public basicGet(): Observable<Message> {

        return this.http.get<Message>(Constants.BASIC_SERVICE_BASE_URL).pipe(
            catchError(this.handleError<Message>("basicGet")),
        );
    }

    public basicPost(message: Message, extension: String): Observable<Message> {
        return this.http.post<Message>(
            Constants.BASIC_SERVICE_BASE_URL + extension,
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
