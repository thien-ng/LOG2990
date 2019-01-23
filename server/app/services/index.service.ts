
// import Axios from "axios";
import { injectable } from "inversify";
import "reflect-metadata";
import { Message } from "../../../common/communication/message";
// import { AxiosPromise } from "./../../node_modules/axios";

@injectable()
export class IndexService {
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
}
