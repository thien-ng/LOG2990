import { injectable } from "inversify";
import { CCommon } from "../../../../common/constantes/cCommon";
import { ClusterCounter } from "./utilities/clusterCounter";
import { Constants } from "./utilities/constants";
import { DifferenceEnlarger } from "./utilities/differenceEnlarger";
import { DifferenceFinder } from "./utilities/differenceFinder";
import { ImageRequirements } from "./utilities/imageRequirements";
import { Message } from "./utilities/message";

@injectable()
export class DifferenceCheckerService {

    private bufferOriginal:  Buffer;
    private bufferModified:  Buffer;
    private differenceImage: Buffer;

    public generateDifferenceImage(requirements: ImageRequirements): Buffer | Message {

        let numberOfDifferences: number = 0;

        try {
            numberOfDifferences = this.calculateDifferences(requirements);
        } catch (error) {
            return this.sendErrorMessage(error.message);
        }
        if (this.imageHasNotDimensionsNeeded(this.bufferOriginal) ||
            this.imageHasNotDimensionsNeeded(this.bufferModified)) {

            return this.sendErrorMessage(Constants.ERROR_IMAGES_DIMENSIONS);
        }

        return (numberOfDifferences === requirements.requiredNbDiff) ?
        this.differenceImage : this.sendErrorMessage(Constants.ERROR_MISSING_DIFFERENCES);
    }

    private calculateDifferences(requirements: ImageRequirements): number {

        this.bufferOriginal  = Buffer.from(requirements.originalImage);
        this.bufferModified  = Buffer.from(requirements.modifiedImage);

        this.differenceImage = this.findDifference(this.bufferOriginal, this.bufferModified);
        this.differenceImage = this.enlargeDifferences(this.differenceImage, requirements.requiredWidth);

        return this.countAllClusters(this.differenceImage, requirements.requiredWidth);
    }

    private findDifference(originalBuffer: Buffer, modifiedBuffer: Buffer): Buffer {
        const differenceFinder: DifferenceFinder = new DifferenceFinder();

        return differenceFinder.searchDifferenceImage(originalBuffer, modifiedBuffer);
    }

    private enlargeDifferences(differenceBuffer: Buffer, width: number): Buffer {
        const differenceEnlarger: DifferenceEnlarger = new DifferenceEnlarger(differenceBuffer, width, Constants.CIRCLE_RADIUS);

        return differenceEnlarger.enlargeAllDifferences();
    }

    private countAllClusters(differenceBuffer: Buffer, width: number): number {
        const clusterCounter: ClusterCounter = new ClusterCounter(differenceBuffer, width);

        return clusterCounter.countAllClusters();
    }

    private sendErrorMessage(message: string): Message {
        return {
            title: CCommon.ON_ERROR,
            body: message,
        } as Message;
    }

    private imageHasNotDimensionsNeeded(buffer: Buffer): boolean {

        const imageWidht:       Buffer = this.extractWidth(buffer);
        const imageHeight:      Buffer = this.extractHeight(buffer);
        const requiredWidth:    Buffer = Buffer.from(Constants.REQUIRED_WIDTH, Constants.BUFFER_FORMAT);
        const requiredHeight:   Buffer = Buffer.from(Constants.REQUIRED_HEIGTH, Constants.BUFFER_FORMAT);

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
