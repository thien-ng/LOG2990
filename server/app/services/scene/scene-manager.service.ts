import { injectable } from "inversify";
import { SceneBuilder } from "./scene-builder";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";

@injectable()
export class SceneManager {

    private SceneBuilder: SceneBuilder;
    private iSceneOptions: ISceneOptions;

    public constructor() {
        this.init();
    }

    public setSceneOptions(iSceneOptions: ISceneOptions): void {
        this.iSceneOptions = iSceneOptions;
    }

    private init(): void {
        this.SceneBuilder = new SceneBuilder(this.iSceneOptions);
    }

}
