import { AxiosInstance, AxiosResponse } from "axios";
import { injectable } from "inversify";
import { ISceneVariablesMessage } from "../../../../common/communication/iSceneVariables";
import { Cache } from "./cache";
import { IDataToCache, IHitConfirmation, IHitToValidate } from "./interfaces";

@injectable()
export class HitValidatorService3D {

    private readonly ERROR_ON_HTTPGET:      string =
    "Didn't succeed to get scene buffer from URL given.";
    private readonly CACHE_SIZE:            number = 5;

    private cache: Cache<ISceneVariablesMessage>;

    public constructor() {
        this.cache = new Cache<ISceneVariablesMessage>(this.CACHE_SIZE);
    }

}
