import { inject } from "inversify";
import { GameMode } from "../../../../../common/communication/iCard";
import { IArenaResponse, IOriginalPixelCluster, IPosition2D } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";
import { CCommon } from "../../../../../common/constantes/cCommon";
import Types from "../../../types";
import { GameManagerService } from "../game-manager.service";
import { Arena } from "./arena";
import { DifferencesExtractor } from "./differencesExtractor";
import { I2DInfos, IArenaInfos, IHitConfirmation, IPlayerInput } from "./interfaces";
import { Player } from "./player";
import { Referee } from "./referee";

export class Arena2D extends Arena<IPlayerInput<IPosition2D>, IOriginalPixelCluster, IPosition2D> {

    protected referee: Referee<IPosition2D, IOriginalPixelCluster>;

    public constructor (
        protected arenaInfos: IArenaInfos<I2DInfos>,
        @inject(Types.GameManagerService) public gameManagerService: GameManagerService) {
            super(arenaInfos, gameManagerService);
            this.ARENA_TYPE = GameMode.simple;
        }

    public async onPlayerClick(position: IPosition2D, user: IUser): Promise<IArenaResponse<IOriginalPixelCluster>> {
        const arenaResponse: IArenaResponse<IOriginalPixelCluster> = await this.referee.onPlayerClick(position, user);
        arenaResponse.arenaType = GameMode.simple;
        this.players.forEach((player: Player) => {
            this.gameManagerService.sendMessage(player.getUserSocketId(), CCommon.ON_ARENA_RESPONSE, arenaResponse);
        });

        return arenaResponse;
    }

    public async prepareArenaForGameplay(): Promise<void> {
        await this.extractOriginalPixelClusters();
        this.referee = new Referee<IPosition2D, IOriginalPixelCluster>(
            this, this.players, this.originalElements as Map<number, IOriginalPixelCluster>,
            this.timer, this.arenaInfos.dataUrl.difference);
    }

    public async validateHit(position: IPosition2D): Promise<IHitConfirmation> {
        return this.referee.validateHit(position);
    }

    public async onPlayerInput(playerInput: IPlayerInput<IPosition2D>): Promise<IArenaResponse<IOriginalPixelCluster>> {
        let response: IArenaResponse<IOriginalPixelCluster>;

        switch (playerInput.event) {
            case this.ON_CLICK:
                response = await this.onPlayerClick(playerInput.eventInfo, playerInput.user);
                break;
            default:
                response = this.buildArenaResponse(this.ON_FAILED_CLICK);
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
