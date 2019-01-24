import Axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import "reflect-metadata";
import { Message } from "../../../common/communication/message";
import { IDate } from "./IDate";

@injectable()
export class DateService {

    public async currentTime(): Promise<Message> {
        const apiResponse: AxiosResponse<IDate> = await Axios.get<IDate>(`http://worldclockapi.com/api/json/est/now`);

        return {
            title: `Time`,
            body: apiResponse.data.currentDateTime.toString(),
        };
    }
}
