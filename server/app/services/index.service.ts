
import Axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import "reflect-metadata";
// import { NameValidatorService } from "../validator/NameValidatorService";
import { Message } from "../../../common/communication/message";

@injectable()
export class IndexService {

    // private _nameValidatorService : NameValidatorService = new NameValidatorService();

    public about(): Message {
        return {
            title: "This is merely a test",
            body: "Lorem ipsum........",
        };
    }

    public async helloWorld(): Promise<Message> {
        return Axios.get<Message>(`http://localhost:3000/api/date`).then((timeMessage: AxiosResponse<Message>) => {
            return {
                title: "Hello world",
                body: "Time is " + timeMessage.data.body,
            };
        }).catch((error: Error) => {
            console.error(`There was an error!!!`, error);

            return {
                title: `Error`,
                body: error.toString(),
            };
        });
    }

    public validateName(message: Message): Message{
        console.log("validate");
        const result = "" ;//this._nameValidatorService.validateName(message);
        return {
            title: "validateNameResponse",
            body: result.toString(),
        };
    }

    public leaveBrowser(message: Message): Message{
        // const result = this._nameValidatorService.leaveBrowser(message.body);
        return {
            title: "validateLeaveBrowser",
            body: "",
        };
    }
}
