import { IArenaResponse } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";
import { Arena } from "./arena";
import { IHitConfirmation } from "./interfaces";

// tslint:disable:no-any
export class Arena3D extends Arena<any, any, any, any> {

    public sendMessage(playerSocketId: string, event: string, message: number): void {
        this.gameManagerService.sendMessage(playerSocketId, event, message);
    }

    public async onPlayerClick(eventInfos: any, user: IUser): Promise<IArenaResponse<any>> {
        throw new Error("Method not implemented.");
    }

    public async validateHit(eventInfos: any): Promise<IHitConfirmation> {
        throw new Error("Method not implemented.");
    }
    public async onPlayerInput(playerInput: any): Promise<IArenaResponse<any>> {
        throw new Error("Method not implemented.");
    }
    public async prepareArenaForGameplay(): Promise<void> {
        throw new Error("Method not implemented.");
    private findObjectToUpdate(modification: IModification, sceneVariableMessage: ISceneVariablesMessage): ISceneObjectUpdate {

        const originalSceneObjects: ISceneObject[] = sceneVariableMessage.originalScene.sceneObjects;
        const modifiedSceneObjects: ISceneObject[] = sceneVariableMessage.modifiedScene.sceneObjects;

        let sceneObjectUpdate: ISceneObjectUpdate;

        switch (modification.type) {
            case ModificationType.added:
                sceneObjectUpdate = this.buildSceneObjectUpdate(ActionType.CHANGE_COLOR, modifiedSceneObjects[modification.id]);
                break;
            case ModificationType.removed:
                sceneObjectUpdate = this.buildSceneObjectUpdate(ActionType.CHANGE_COLOR, originalSceneObjects[modification.id]);
                break;
            case ModificationType.changedColor:
                sceneObjectUpdate = this.buildSceneObjectUpdate(ActionType.CHANGE_COLOR, originalSceneObjects[modification.id]);
                break;
            default:
                sceneObjectUpdate = this.buildSceneObjectUpdate(ActionType.CHANGE_COLOR);
                break;
        }

        return sceneObjectUpdate;
    }

    }
}
