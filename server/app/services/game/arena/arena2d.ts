import { inject } from "inversify";
import { GameMode } from "../../../../../common/communication/iCard";
import { IArenaResponse, IOriginalPixelCluster, IPosition2D } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";
import { Constants } from "../../../constants";
import Types from "../../../types";
import { GameManagerService } from "../game-manager.service";
import { Arena } from "./arena";
import { DifferencesExtractor } from "./differencesExtractor";
import { I2DInfos, IArenaInfos, IHitConfirmation, IPlayerInput } from "./interfaces";
import { Referee } from "./referee";

export class Arena2D extends Arena<IPlayerInput<IPosition2D>, IArenaResponse<IOriginalPixelCluster>, IOriginalPixelCluster, IPosition2D> {

    protected referee: Referee<IPosition2D, IOriginalPixelCluster>;

    public constructor (
        protected arenaInfos: IArenaInfos<I2DInfos>,
        @inject(Types.GameManagerService) public gameManagerService: GameManagerService) {
            super(arenaInfos, gameManagerService);
            this.ARENA_TYPE = GameMode.simple;
            this.DEFAULT_DIFF_TO_UPDATE = Constants.ON_ERROR_PIXEL_CLUSTER;
        }

    public sendMessage(playerSocketId: string, event: string, message: number): void {
        this.gameManagerService.sendMessage(playerSocketId, event, message);
    }

    public async onPlayerClick(position: IPosition2D, user: IUser): Promise<IArenaResponse<IOriginalPixelCluster>> {
        const arenaResponse: IArenaResponse<IOriginalPixelCluster> = await this.referee.onPlayerClick(position, user);
        arenaResponse.arenaType = GameMode.simple;

        return arenaResponse;
    }

    public async prepareArenaForGameplay(): Promise<void> {
        await this.extractOriginalPixelClusters();
        this.referee = new Referee<IPosition2D, IOriginalPixelCluster>(
            this, this._players, this.originalElements, this.timer, this.arenaInfos.dataUrl.difference);
    }

    public async validateHit(position: IPosition2D): Promise<IHitConfirmation> {
        return this.referee.validateHit(position);
    }

    public async onPlayerInput(playerInput: IPlayerInput<IPosition2D>): Promise<IArenaResponse<IOriginalPixelCluster>> {

        let response: IArenaResponse<IOriginalPixelCluster> = this.buildArenaResponse(
            this.ON_FAILED_CLICK,
            this.DEFAULT_DIFF_TO_UPDATE,
        );

        switch (playerInput.event) {
            case this.ON_CLICK:
                response = await this.onPlayerClick(playerInput.eventInfo, playerInput.user);
                break;
            default:
                break;
        }

        return response;
    }

    private async extractOriginalPixelClusters(): Promise<void> {
        const originalImage:    Buffer                  = await this.getDifferenceDataFromURL(this.arenaInfos.dataUrl.original);
        const differenceImage:  Buffer                  = await this.getDifferenceDataFromURL(this.arenaInfos.dataUrl.difference);
        const extractor:        DifferencesExtractor    = new DifferencesExtractor();
        this.originalElements = extractor.extractPixelClustersFrom(originalImage, differenceImage);
    }
}
