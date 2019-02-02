import { injectable } from "inversify";
import { BufferManager } from "./utilities/bufferManager";
import { CircleDifferences } from "./utilities/circleDifferences";
import { ClusterCounter } from "./utilities/clusterCounter";
import { IImageRequirements } from "./utilities/iimageRequirements";
import { ImagesDifference } from "./utilities/imagesDifference";
import { Message } from "./utilities/message";

const CIRCLE_RADIUS: number = 3;

@injectable()
export class DifferenceCheckerService {

    private bufferManager: BufferManager;

    public constructor() {
        this.bufferManager = new BufferManager();
    }

    // tslint:disable-next-line:max-func-body-length
    public generateDifferenceImage(requirements: IImageRequirements): Buffer | Message {

        const splittedOriginal: Buffer[] = this.bufferManager.splitHeader(requirements.originalImage);
        const splittedDifferent: Buffer[] = this.bufferManager.splitHeader(requirements.modifiedImage);

        const differencesFound: number[] = this.findDifference(splittedOriginal[1], splittedDifferent[1]);
        const circledDifferences: number[] = this.circleDifference(differencesFound, requirements.requiredWidth);
        const numberOfDifferences: number = this.countAllClusters(circledDifferences, requirements.requiredWidth);

        if (numberOfDifferences === requirements.requiredNbDiff) {

            const dataImageBuffer: Buffer = this.bufferManager.arrayToBuffer(circledDifferences);
            const diffImgBuffer: Buffer = this.bufferManager.mergeBuffers(splittedOriginal[0], dataImageBuffer);
            console.log(diffImgBuffer);

            return diffImgBuffer;

        } else {

            return {
                title: "onError",
                body: "Les images ne contiennent pas 7 erreures",
            } as Message;

        }
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
}
