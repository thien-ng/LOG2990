import { injectable } from "inversify";
import { Message } from "../../../../common/communication/message";
import { BufferManager } from "./utilities/bufferManager";
import { CircleDifferences } from "./utilities/circleDifferences";
import { ClusterCounter } from "./utilities/clusterCounter";
import { ImageRequirements } from "./utilities/imageRequirements";
import { ImagesDifference } from "./utilities/imagesDifference";
import { Constants } from "../../constants";

@injectable()
export class DifferenceCheckerService {

    private bufferManager: BufferManager;
    private splittedOriginal: Buffer[];
    private splittedDifferent: Buffer[];
    private circledDifferences: number[];

    public constructor() {
        this.bufferManager = new BufferManager();
    }

    public generateDifferenceImage(requirements: ImageRequirements): Buffer | Message {

        let numberOfDifferences: number = 0;

        try {
            numberOfDifferences = this.calculateDifferences(requirements);
        } catch (error) {
            return this.sendErrorMessage(error.message);
        }

        if (this.imageHasNotDimensionsNeeded(this.splittedOriginal) ||
            this.imageHasNotDimensionsNeeded(this.splittedDifferent)) {

            return this.sendErrorMessage(Constants.ERROR_IMAGES_DIMENSIONS);
        }

        if (numberOfDifferences === requirements.requiredNbDiff) {

            const dataImageBuffer: Buffer = this.bufferManager.arrayToBuffer(this.circledDifferences);

            return this.bufferManager.mergeBuffers(this.splittedOriginal[0], dataImageBuffer);

        } else {

            return this.sendErrorMessage(Constants.ERROR_MISSING_DIFFERENCES);
        }
    }

    private calculateDifferences(requirements: ImageRequirements): number {

        this.splittedOriginal = this.bufferManager.splitHeader(requirements.originalImage);
        this.splittedDifferent = this.bufferManager.splitHeader(requirements.modifiedImage);

        const differencesFound: number[] = this.findDifference(this.splittedOriginal[1], this.splittedDifferent[1]);
        this.circledDifferences = this.circleDifference(differencesFound, requirements.requiredWidth);

        return this.countAllClusters(this.circledDifferences, requirements.requiredWidth);
    }

    private findDifference(orignalBuffer: Buffer, differenceBuffer: Buffer): number[] {
        const imagesDifference: ImagesDifference = new ImagesDifference();

        return imagesDifference.searchDifferenceImage(orignalBuffer, differenceBuffer);
    }

    private circleDifference(differencesArray: number[], width: number): number[] {
        const circleDifferences: CircleDifferences = new CircleDifferences( differencesArray, width, Constants.CIRCLE_RADIUS);

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
        } as Message;
    }

    private imageHasNotDimensionsNeeded(splittedBuffer: Buffer[]): boolean {
        const imageWidht: Buffer = this.extractWidth(splittedBuffer[0]);
        const imageHeight: Buffer = this.extractHeight(splittedBuffer[0]);

        const requiredWidth: Buffer = Buffer.from(Constants.REQUIRED_WIDTH, Constants.BUFFER_FORMAT);
        const requiredHeight: Buffer = Buffer.from(Constants.REQUIRED_HEIGTH, Constants.BUFFER_FORMAT);

        let isEqual: boolean = true;

        for (let i: number = 0; i < imageWidht.length; i++) {
            if (imageWidht[i] !== requiredWidth[i] ||
               imageHeight[i] !== requiredHeight[i]) {
                   isEqual = false;
               }
        }

        return !isEqual;
    }

    private extractWidth(buffer: Buffer): Buffer {
        return buffer.slice(Constants.BUFFER_START_DIMENSION, Constants.BUFFER_MIDDLE_DIMENSION);
    }

    private extractHeight(buffer: Buffer): Buffer {
        return buffer.slice(Constants.BUFFER_MIDDLE_DIMENSION, Constants.BUFFER_END_DIMENSION);
    }

}
