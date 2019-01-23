
// import Axios from "axios";
import { injectable } from "inversify";
import "reflect-metadata";
import { NameValidatorService } from "../validator/NameValidatorService";
import { Message } from "../../../common/communication/message";
// import { AxiosPromise } from "./../../node_modules/axios";

@injectable()
export class IndexService {

    private _nameValidatorService : NameValidatorService = new NameValidatorService();

    public about(): Message {
        return {
            title: "This is merely a test",
            body: "Lorem ipsum........",
        };
    }
    // DEMANDER AU CHARGE COMMENT REGLER CE CRISS DE LINT
    public async helloWorld(): Promise<Message> {
        // return Axios.get<Message>(`http://localhost:3000/api/date`).then((timeMessage) => {
        //     return {
        //         title: "Hello world",
        //         body: "Time is " + timeMessage.data.body,
        //     };
        // }).catch((error: Error) => {
        //     console.error(`There was an error!!!`, error);

        //     return {
        //         title: `Error`,
        //         body: error.toString(),
        //     };
        // });
        return {
            title: "fuck this",
            body: "fuck that",
        };
    }

    public validateName(message: Message): Message{
        const result = this._nameValidatorService.validateName(message);
        const stringifyResult = result.toString();
        const newMessage: Message  = {
            title: "validateNameResponse",
            body: stringifyResult,
        };
        return newMessage;
    }

    public leaveBrowser(message: Message): Message{
        const result = this._nameValidatorService.leaveBrowser(message.body);
        const stringifyResult = result.toString();
        const newMessage: Message  = {
            title: "validateLeaveBrowser",
            body: stringifyResult,
        };
        return newMessage;
    }
}
