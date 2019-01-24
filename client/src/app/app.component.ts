import { Component, OnInit, OnDestroy } from "@angular/core";
import { Message } from "../../../common/communication/message";
import { BasicService } from "./basic.service";
import { LoginValidatorService } from "./login/login-validator.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy{
    public constructor(
        private _basicService: BasicService,
        private _loginValidatorService: LoginValidatorService) { }

    public readonly title: string = "LOG2990";
    public message: string;

    public ngOnInit(): void {
        this._basicService.basicGet().subscribe((message: Message) => this.message = message.title + message.body);
    }

    public ngOnDestroy(): void {
        this._loginValidatorService.getUsername();
        let message = {
            title: "testDestroy",
            body: "test"
        }
        this._basicService.basicGet().subscribe((message: Message) => this.message = message.title + message.body);

        this._basicService.basicPost(message, "service/validator/unsubscribe").subscribe( (element) => {
            console.log(element);
        });
    }
}
