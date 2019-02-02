import { injectable } from "inversify";
import { CircleDifferences } from "./utilities/circleDifferences";
import { ClusterCounter } from "./utilities/clusterCounter";
import { IImageRequirements } from "./utilities/iimageRequirements";
import { ImagesDifference } from "./utilities/imagesDifference";
// import { Message } from "./utilities/message";
import { BufferManager } from "./utilities/bufferManager";

const CIRCLE_RADIUS: number = 3;

@injectable()
export class DifferenceCheckerService {

    private bufferManager: BufferManager;

    public constructor() {
        this.bufferManager = new BufferManager();
    }

    // tslint:disable-next-line:max-func-body-length
    public generateDifferenceImage(requirements: IImageRequirements): Buffer {

        const splittedBuffer1: Buffer[] = this.bufferManager.splitHeader(requirements.originalImage);
        const splittedBuffer2: Buffer[] = this.bufferManager.splitHeader(requirements.modifiedImage);

        const headerTemplate: Buffer[] = JSON.parse(JSON.stringify(splittedBuffer1[0]));

        const imagesDifference: ImagesDifference = new ImagesDifference();
        const differencesFound: number[] = imagesDifference.searchDifferenceImage(splittedBuffer1[1], splittedBuffer2[1]);

        const circleDifferences: CircleDifferences = new CircleDifferences( differencesFound, requirements.requiredWidth, CIRCLE_RADIUS);
        const circledDifferences: number[] = circleDifferences.circleAllDifferences();

        const clusterCounter: ClusterCounter = new ClusterCounter(circledDifferences, requirements.requiredWidth);
        console.log(clusterCounter.countAllClusters());
        
        // if (clusterCounter.countAllClusters() === requirements.requiredNbDiff) {
            this.bufferManager.mergeBuffers(splittedBuffer1[0], splittedBuffer1[1]);
            this.bufferManager.mergeBuffers(splittedBuffer2[0], splittedBuffer2[1]);
            const dataImageBuffer: Buffer = this.bufferManager.arrayToBuffer(circledDifferences);
            // retourner limage
            // console.log(dataImageBuffer);
            const diffImgBuffer: Buffer = this.bufferManager.mergeBuffers(headerTemplate[0], dataImageBuffer);
            
            return diffImgBuffer;
        // } else {
            
        //     return {
        //         title: "onError",
        //         body: "Les images ne contiennent pas 7 erreures",
        //     } as Message;
        // }
    }

    // private buildImage(enlargedErrors: number[]): void {
    //     // TBD
    // }

}
