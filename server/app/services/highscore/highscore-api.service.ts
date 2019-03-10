import { injectable } from "inversify";
import {
    Highscore,
    HighscoreValidationMessage,
    HighscoreValidationResponse,
    Mode,
    Position,
    SortTimesResponse,
    Time
} from "./utilities/interfaces";

const REMOVE_NOTHING:           number = 0;
const ON_SUCCESS:               string = "onSuccess";
const INVALID_MODE:             string = "invalidMode";
const INVALID_PARAMS_VALUE:     string = "invalidParamsValue";
const INVALID_PARAMS:           string = "invalidParams";

@injectable()
export class HighscoreApiService {
    public checkScore(newValue: Time, times: Highscore, mode: Mode): Highscore {
        if (newValue.time < 0) {
            return times;
        }

        switch (mode) {
            case Mode.Singleplayer:
                times.timesSingle = this.sortTimes(times.timesSingle, newValue);
                break;
            case Mode.Multiplayer:
                times.timesMulti = this.sortTimes(times.timesMulti, newValue);
                break;
            default:
                break;
        }

        return times;
    }

    private sortTimes(times: [Time, Time, Time], newValue: Time): [Time, Time, Time] {
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
