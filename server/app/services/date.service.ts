// import Axios from "axios";
import { injectable } from "inversify";
import "reflect-metadata";
import { Message } from "../../../common/communication/message";
// import { IDate } from "./IDate";

@injectable()
export class DateService {

    // Demander au charge de lab comment regler ce criss de lint
    public async currentTime(): Promise<Message> {
        // const apiResponse: any = await Axios.get<IDate>(`http://worldclockapi.com/api/json/est/now`);

        // return {
        //     title: `Time`,
        //     body: apiResponse.data.currentDateTime.toString(),
        // };
        return {
            title: "fuckthis",
            body: "fuck that",
        };
    }
}
