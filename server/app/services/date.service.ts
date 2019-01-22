import Axios from "axios";
import { injectable } from "inversify";
import "reflect-metadata";
import { IDate } from "./IDate";
import { Message } from "../../../common/communication/message";

@injectable()
export class DateService {

    public async currentTime(): Promise<Message> {
        const apiResponse = await Axios.get<IDate>(`http://worldclockapi.com/api/json/est/now`);

        return {
            title: `Time`,
            body: apiResponse.data.currentDateTime.toString(),
        };

    }
}
