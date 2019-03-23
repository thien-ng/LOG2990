import { inject } from "inversify";
import { GameMode } from "../../../../../common/communication/iCard";
import { ActionType, IArenaResponse, ISceneObjectUpdate } from "../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../common/communication/iSceneObject";
import { IModification, ISceneData, ModificationType } from "../../../../../common/communication/iSceneVariables";
import { IUser } from "../../../../../common/communication/iUser";
import { CCommon } from "../../../../../common/constantes/cCommon";
import Types from "../../../types";
import { GameManagerService } from "../game-manager.service";
import { Arena } from "./arena";
import { I3DInfos, IArenaInfos, IHitConfirmation, IPlayerInput } from "./interfaces";
import { Player } from "./player";
import { Referee } from "./referee";

// _TODO: Remove this line after replacing all the anys
// tslint:disable:no-any
export class Arena3D extends Arena<
    IPlayerInput<number>,
    IArenaResponse<ISceneObjectUpdate<ISceneObject | IMesh>>,
    ISceneObjectUpdate<ISceneObject | IMesh>,
    number> {

    protected referee: Referee<number, ISceneObjectUpdate<ISceneObject | IMesh>>;

    public constructor (
        protected arenaInfos: IArenaInfos<I3DInfos>,
        @inject(Types.GameManagerService) public gameManagerService: GameManagerService) {
            super(arenaInfos, gameManagerService);
            this.ARENA_TYPE = GameMode.free;
    }

    public async onPlayerClick(objectId: number, user: IUser): Promise<IArenaResponse<ISceneObjectUpdate<ISceneObject | IMesh>>> {
        const arenaResponse: IArenaResponse<ISceneObjectUpdate<ISceneObject | IMesh>> = await this.referee.onPlayerClick(objectId, user);
        arenaResponse.arenaType = GameMode.free;
        this.players.forEach((player: Player) => {
            this.gameManagerService.sendMessage(player.getUserSocketId(), CCommon.ON_ARENA_RESPONSE, arenaResponse);
        });

        return arenaResponse;
    }

    public async validateHit(objectId: number): Promise<IHitConfirmation> {
        return this.referee.validateHit(objectId);
    }

    public async onPlayerInput(playerInput: IPlayerInput<number>): Promise<IArenaResponse<ISceneObjectUpdate<ISceneObject | IMesh>>> {

        let response: IArenaResponse<ISceneObjectUpdate<ISceneObject | IMesh>> = this.buildArenaResponse(
            this.ON_FAILED_CLICK,
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

    public async prepareArenaForGameplay(): Promise<void> {
        await this.extractModifiedSceneObjects();
        this.referee = new Referee<number, ISceneObjectUpdate<ISceneObject | IMesh>>(
            this, this.players, this.originalElements, this.timer, this.arenaInfos.dataUrl.sceneData);
    }

    private async extractModifiedSceneObjects(): Promise<void> {
        const sceneData:        Buffer      = await this.getDifferenceDataFromURL(this.arenaInfos.dataUrl.sceneData);
        const sceneDataObject:  ISceneData<ISceneObject>  = JSON.parse(sceneData.toString()) as ISceneData<ISceneObject>;

        sceneDataObject.modifications.forEach((modification: IModification) => {
            const sceneObjectUpdate: ISceneObjectUpdate<ISceneObject | IMesh> = this.findObjectToUpdate(modification, sceneDataObject);
            this.originalElements.set(modification.id, sceneObjectUpdate);
        });

    }

    private findObjectToUpdate(
        modification: IModification, sceneVariableMessage: ISceneData<ISceneObject | IMesh>): ISceneObjectUpdate<ISceneObject | IMesh> {

        const originalSceneObjects: (ISceneObject | IMesh)[] = sceneVariableMessage.originalScene.sceneObjects;
        const modifiedSceneObjects: (ISceneObject | IMesh)[] = sceneVariableMessage.modifiedScene.sceneObjects;

        let sceneObjectUpdate: ISceneObjectUpdate<ISceneObject | IMesh>;

        switch (modification.type) {
            case ModificationType.added:
                sceneObjectUpdate = this.buildSceneObjectUpdate(
                    ActionType.DELETE,
                    this.findObjectById(modification.id, modifiedSceneObjects as ISceneObject[]));
                break;
            case ModificationType.removed:
                sceneObjectUpdate = this.buildSceneObjectUpdate(ActionType.ADD, originalSceneObjects[modification.id] as ISceneObject);
                break;
            case ModificationType.changedColor:
                sceneObjectUpdate =
                    this.buildSceneObjectUpdate(ActionType.CHANGE_COLOR, originalSceneObjects[modification.id] as ISceneObject);
                break;
            default:
                sceneObjectUpdate = this.buildSceneObjectUpdate(ActionType.NO_ACTION_REQUIRED);
                break;
        }

        return sceneObjectUpdate;
    }

    private findObjectById(id: number, objectList: ISceneObject[]): ISceneObject | undefined {

        return objectList.find((object: ISceneObject) => {
            return id === object.id;
        });
    }

    private buildSceneObjectUpdate(actionType: ActionType, sceneObject?: ISceneObject): ISceneObjectUpdate<ISceneObject | IMesh> {
        return {
            actionToApply:  actionType,
            sceneObject:    sceneObject,
        } as ISceneObjectUpdate<ISceneObject | IMesh>;
    }
}
