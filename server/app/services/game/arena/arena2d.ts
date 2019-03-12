import { inject } from "inversify";
import { GameMode } from "../../../../../common/communication/iCard";
import { IArenaResponse, IOriginalPixelCluster, IPosition2D } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";
import { Constants } from "../../../constants";
import Types from "../../../types";
import { GameManagerService } from "../game-manager.service";
import { Arena } from "./arena";
import { DifferencesExtractor } from "./differencesExtractor";
import { IArenaInfos, IHitConfirmation, IPlayerInput } from "./interfaces";
import { Referee } from "./referee";

export class Arena2D extends Arena<IPlayerInput<IPosition2D>, IArenaResponse<IOriginalPixelCluster>, IOriginalPixelCluster, IPosition2D> {

    private referee: Referee<IPosition2D, IOriginalPixelCluster>;

    public constructor (
        protected arenaInfos: IArenaInfos,
        @inject(Types.GameManagerService) public gameManagerService: GameManagerService) {

            super(arenaInfos, gameManagerService);
            this.ARENA_TYPE = GameMode.simple;
            this.DEFAULT_DIFF_TO_UPDATE = Constants.ON_ERROR_PIXEL_CLUSTER;
        }

    public async onPlayerClick(position: IPosition2D, user: IUser): Promise<IArenaResponse<IOriginalPixelCluster>> {
    }

    public async prepareArenaForGameplay(): Promise<void> {
    }

    public async validateHit(position: IPosition2D): Promise<IHitConfirmation> {
    }
    public async onPlayerInput(playerInput: IPlayerInput<IPosition2D>): Promise<IArenaResponse<IOriginalPixelCluster>> {
    }

    private async extractOriginalPixelClusters(): Promise<void> {
    }
}
