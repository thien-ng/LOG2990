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

    public validateParams(params: HighscoreValidationMessage): boolean {
        if (this.timeListIsValid(params.times)) {
            if (this.modeIsValid(params.mode)) {
                if (this.timeIsValid(params.newValue)) {
                    return true;
                }
            }
        }

        return false;
    }

    public checkScoreRoutine(params: HighscoreValidationMessage): HighscoreValidationResponse {
        try {
            const paramsIsValid: boolean = this.validateParams(params);

            if (paramsIsValid) {
                return this.checkScore(params);
            }

            return {
                status: INVALID_PARAMS_VALUE,
            } as HighscoreValidationResponse;

        } catch (error) {
            return {
                status: INVALID_PARAMS,
            } as HighscoreValidationResponse;
        }
    }

    private checkScore(params: HighscoreValidationMessage): HighscoreValidationResponse {
        let sortTimesResponse: SortTimesResponse;
        switch (params.mode) {
            case Mode.Singleplayer:
                sortTimesResponse = this.sortTimes(params.times.timesSingle, params.newValue);
                params.times.timesSingle = sortTimesResponse.times;

                return {
                    status: sortTimesResponse.status,
                    isNewHighscore: sortTimesResponse.isNewHighscore,
                    index: sortTimesResponse.index,
                    highscore: params.times,
                };
            case Mode.Multiplayer:
                sortTimesResponse = this.sortTimes(params.times.timesMulti, params.newValue);
                params.times.timesMulti = sortTimesResponse.times;

                return {
                    status: sortTimesResponse.status,
                    isNewHighscore: sortTimesResponse.isNewHighscore,
                    index: sortTimesResponse.index,
                    highscore: params.times,
                };
            default:
                return {
                    status: INVALID_MODE,
                } as HighscoreValidationResponse;
        }
    }

    private sortTimes(times: [Time, Time, Time], newValue: Time): SortTimesResponse {
        let hasBeenReplaced: boolean = false;
        let position: Position = Position.notReplaced;

        for (let i: number = 0; i < times.length; i++) {
            if (times[i].time > newValue.time && !hasBeenReplaced) {
                times.splice(i, REMOVE_NOTHING, newValue);
                times.pop();
                hasBeenReplaced = true;
                position = i;
            }
        }

        return {
            status: ON_SUCCESS,
            isNewHighscore: hasBeenReplaced,
            index: position,
            times: times,
        };
    }

    private timeIsValid(newValue: Time): boolean {
        if (typeof newValue.username === "string" && newValue.username !== "") {
            if (newValue.time >= 0) {
                return true;
            }
        }

        return false;
    }

    private modeIsValid(mode: Mode): boolean {
        return (mode === Mode.Singleplayer || mode === Mode.Multiplayer);
    }

    private timeListIsValid(times: Highscore): boolean {
        const idIsValid: boolean = (times.id > 0);
        const timesSingleIsValid: boolean = times.timesSingle.every((t: Time) =>  this.timeIsValid(t)) && (times.timesSingle.length > 0);
        const timesMultiIsValid: boolean = times.timesMulti.every((t: Time) =>  this.timeIsValid(t)) && (times.timesMulti.length > 0);

        return idIsValid && timesSingleIsValid && timesMultiIsValid;
    }

}
