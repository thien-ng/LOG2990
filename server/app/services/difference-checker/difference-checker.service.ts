import { injectable } from "inversify";
import { Message } from "../../../../common/communication/message";
import { Constants } from "../../constants";
import { BufferManager } from "./utilities/bufferManager";
import { CircleDifferences } from "./utilities/circleDifferences";
import { ClusterCounter } from "./utilities/clusterCounter";
import { ImageRequirements } from "./utilities/imageRequirements";
import { ImagesDifference } from "./utilities/imagesDifference";

const HEADER_SIZE: number = 54;

@injectable()
export class DifferenceCheckerService {

    private bufferManager: BufferManager;
    private bufferOriginal: Buffer;
    private bufferModified: Buffer;
    private circledDifferences: number[];

    public constructor() {
        this.bufferManager = new BufferManager();
    }

    public generateDifferenceImage(requirements: ImageRequirements): Buffer | Message {

        let numberOfDifferences: number = 0;

        try {
            numberOfDifferences = this.calculateDifferences(requirements);
        } catch (error) {
            return this.generateError(error); // A DEMANDER AU CHARGE

        }
        if (this.imageHasNotDimensionsNeeded(this.bufferOriginal) ||
            this.imageHasNotDimensionsNeeded(this.bufferModified)) {

            return this.sendErrorMessage(Constants.ERROR_IMAGES_DIMENSIONS);
        }

        if (numberOfDifferences === requirements.requiredNbDiff) {

            const dataImageBuffer: Buffer = this.bufferManager.arrayToBuffer(this.circledDifferences);

            return this.bufferManager.mergeBuffers(this.bufferOriginal.slice(0, HEADER_SIZE), dataImageBuffer);

        } else {

            return this.sendErrorMessage(Constants.ERROR_MISSING_DIFFERENCES);
        }
    }

    private calculateDifferences(requirements: ImageRequirements): number {

        this.bufferOriginal = Buffer.from(requirements.originalImage);
        this.bufferModified = Buffer.from(requirements.modifiedImage);

        const differencesFound: number[] = this.findDifference(this.bufferOriginal, this.bufferModified);
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
            title: Constants.ON_ERROR_MESSAGE,
            body: message,
        } as Message;
    }

    private imageHasNotDimensionsNeeded(buffer: Buffer): boolean {

        const imageWidht: Buffer = this.extractWidth(buffer);
        const imageHeight: Buffer = this.extractHeight(buffer);
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

    private generateError(error: Error): Message {
        const isTypeError: boolean = error instanceof TypeError;
        const errorMessage: string =  isTypeError ? error.message : Constants.UNKNOWN_ERROR;

        return this.sendErrorMessage(errorMessage);
    }

}
