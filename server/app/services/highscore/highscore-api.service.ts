import { injectable } from "inversify";
import { Time } from "./utilities/interfaces";

const REMOVE_NOTHING: number = 0;

@injectable()
export class HighscoreApiService {
    public checkScore(newValue: Time, times: [Time, Time, Time]): [Time, Time, Time] {
        // todo if -1
        let hasBeenReplaced: Boolean = false;

        times.forEach((element: Time) => {
            if (element.time > newValue.time && !hasBeenReplaced) {
                times.splice(times.indexOf(element), REMOVE_NOTHING, newValue);
                times.pop();
                hasBeenReplaced = true;
            }
        });

        return times;
    }
}
