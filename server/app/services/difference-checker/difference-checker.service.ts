import { injectable } from "inversify";
import { CircleDifferences } from "./utilities/circleDifferences";
import { ClusterCounter } from "./utilities/clusterCounter";
import { IImageRequirements } from "./utilities/iimageRequirements";
import { ImagesDifference } from "./utilities/imagesDifference";
import { Message } from "./utilities/message";
import { BufferManager } from "./utilities/bufferManager";

const CIRCLE_RADIUS: number = 3;

@injectable()
export class DifferenceCheckerService {

    private bufferManager: BufferManager;

    public constructor() {
        this.bufferManager = new BufferManager();
    }

    // tslint:disable-next-line:max-func-body-length
    public generateDifferenceImage(requirements: IImageRequirements): Buffer | Message {

        const splittedBuffer1: Buffer[] = this.bufferManager.splitHeader(requirements.originalImage);
        const splittedBuffer2: Buffer[] = this.bufferManager.splitHeader(requirements.modifiedImage);

        const headerTemplate: Buffer = JSON.parse(JSON.stringify(splittedBuffer1[0]));

        const differencesFound: number[] = this.findDifference(splittedBuffer1[1], splittedBuffer2[1]);
        const circledDifferences: number[] = this.circleDifference(differencesFound, requirements.requiredWidth);
        const numberOfDifferences: number = this.countAllClusters(circledDifferences, requirements.requiredWidth);
        
        if (numberOfDifferences === requirements.requiredNbDiff) {
            console.log("in");

            const dataImageBuffer: Buffer = this.bufferManager.arrayToBuffer(circledDifferences);
            // retourner limage
            // console.log(dataImageBuffer);
            const diffImgBuffer: Buffer = this.bufferManager.mergeBuffers(headerTemplate, dataImageBuffer);
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

    // private buildImage(enlargedErrors: number[]): void {
    //     // TBD
    // }

}
