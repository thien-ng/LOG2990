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
    }
}
