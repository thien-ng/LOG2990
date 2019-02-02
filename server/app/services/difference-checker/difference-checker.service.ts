import { injectable } from "inversify";
import { BufferManager } from "./utilities/bufferManager";
import { CircleDifferences } from "./utilities/circleDifferences";
import { ClusterCounter } from "./utilities/clusterCounter";
import { ImageRequirements } from "./utilities/imageRequirements";
import { ImagesDifference } from "./utilities/imagesDifference";
import { Message } from "../../../../common/communication/message";

const CIRCLE_RADIUS: number = 3;

@injectable()
export class DifferenceCheckerService {

    private bufferManager: BufferManager;
    private splittedOriginal: Buffer[];
    private circledDifferences: number[];

    public constructor() {
        this.bufferManager = new BufferManager();
    }

    public generateDifferenceImage(requirements: ImageRequirements): Buffer | Message {

        let numberOfDifferences: number = 0;
        
        try {

            numberOfDifferences = this.calculateDifferences(requirements);
        } catch(error) {
            return this.sendErrorMessage(error.message);
        }

        if (numberOfDifferences === requirements.requiredNbDiff) {

            const dataImageBuffer: Buffer = this.bufferManager.arrayToBuffer(this.circledDifferences);

            return this.bufferManager.mergeBuffers(this.splittedOriginal[0], dataImageBuffer);

        } else {

            return this.sendErrorMessage("Les images ne contiennent pas 7 erreures");
        }
    }

    private calculateDifferences(requirements: ImageRequirements): number {

        this.splittedOriginal = this.bufferManager.splitHeader(requirements.originalImage);
        const splittedDifferent: Buffer[] = this.bufferManager.splitHeader(requirements.modifiedImage);

        const differencesFound: number[] = this.findDifference(this.splittedOriginal[1], splittedDifferent[1]);
        this.circledDifferences = this.circleDifference(differencesFound, requirements.requiredWidth);

        return this.countAllClusters(this.circledDifferences, requirements.requiredWidth);
    }

    private findDifference(orignalBuffer: Buffer, differenceBuffer: Buffer): number[] {
        const imagesDifference: ImagesDifference = new ImagesDifference();

        return imagesDifference.searchDifferenceImage(orignalBuffer, differenceBuffer);
    }

    private circleDifference(differencesArray: number[], width: number): number[] {
        const circleDifferences: CircleDifferences = new CircleDifferences( differencesArray, width, CIRCLE_RADIUS);

        return circleDifferences.circleAllDifferences();
    }

    private countAllClusters(differenceList: number[], width: number): number {
        const clusterCounter: ClusterCounter = new ClusterCounter(differenceList, width);

        return clusterCounter.countAllClusters();
    }

    private sendErrorMessage(message: string): Message {
        return {
            title: "onError",
            body: message,
        } as Message
    }

}
