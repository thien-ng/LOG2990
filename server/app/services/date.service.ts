import { Message } from "../../../common/communication/message";
import "reflect-metadata";
import { injectable } from "inversify";
import { IDate } from "./IDate";
import Axios from "axios";

@injectable()
export class DateService {

    public async currentTime(): Promise<Message> {
        const apiResponse = await Axios.get<IDate>(`http://worldclockapi.com/api/json/est/now`);
        return {
            title: `Time`,
            body: apiResponse.data.currentDateTime.toString()
        };
    }
}
