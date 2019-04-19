import { Constants } from "./constants";

interface IEdges {
    isOnTopEdge:    boolean;
    isOnBottomEdge: boolean;
    isOnLeftEdge:   boolean;
    isOnRightEdge:  boolean;
}

export class ClusterCounter {

    private readonly OFFSET_LEFT:    number = -1;
    private readonly OFFSET_RIGHT:   number =  1;
    private readonly DOES_NOT_EXIST: number = -1;

    private visitedColor: number = 1;

    public constructor(public differenceBuffer: Buffer, public width: number) {}

    public countAllClusters(): number {

        let clusterCounter: number = 0;
        const bufferLenght: number = this.differenceBuffer.length;

        for (let bytePos: number = Constants.BMP_HEADER_SIZE; bytePos < bufferLenght; bytePos += Constants.PIXEL_24B_SIZE) {
            if (this.differenceBuffer[bytePos] === Constants.IS_A_DIFFERENCE) {

                const pixelIndex: number = this.convertToPixelPosition(bytePos);
                this.findAllConnectedDifferences(pixelIndex);
                clusterCounter++;
                this.visitedColor++;
            }
        }

        return clusterCounter;
    }

    // will only work with an image that's a width multiple of 4
    private convertToPixelPosition(bytePosition: number): number {
        return Math.floor((bytePosition - Constants.BMP_HEADER_SIZE) / Constants.PIXEL_24B_SIZE);
    }

    // will only work with an image that's a width multiple of 4
    private convertToBytePosition(pixelPosition: number): number {
        return pixelPosition * Constants.PIXEL_24B_SIZE + Constants.BMP_HEADER_SIZE;
    }

    // will only work with an image that's a width multiple of 4
    private numberOfPixelsInImage(): number {
        const imageSizeInBytes: number = this.differenceBuffer.length - Constants.BMP_HEADER_SIZE;

        return Math.floor(imageSizeInBytes / Constants.PIXEL_24B_SIZE);
    }

    private setPixelAsDifference(pixelPosition: number, color: number): void {
        const firstByte: number = this.convertToBytePosition(pixelPosition);

        for (let offset: number = 0; offset < Constants.PIXEL_24B_SIZE; offset++) {
            this.differenceBuffer[firstByte + offset] = color;
        }
    }

    private pixelIsADifference(pixelPosition: number): boolean {
        const firstByte: number = this.convertToBytePosition(pixelPosition);

        return this.differenceBuffer[firstByte] === Constants.IS_A_DIFFERENCE;
    }

    private findAllConnectedDifferences(pixelPosition: number): void {

        let stackOfDifferences: number[]    = [pixelPosition];
        let nbAddedDifferences: number      = 1;
        let nbVisitedNeighbors: number      = 1;
        this.setPixelAsDifference(pixelPosition, this.visitedColor);

        while (stackOfDifferences.length !== 0) {

            let allNeighboringDifferences: number[];
            nbAddedDifferences = 0;

            for (let i: number = 0; i < nbVisitedNeighbors; i++) {
                const currentDifferencePixel: number = stackOfDifferences[0];
                allNeighboringDifferences = this.getNeighboringDifferences(currentDifferencePixel);
                this.setAllToVisited(allNeighboringDifferences);
                nbAddedDifferences += allNeighboringDifferences.length;
                stackOfDifferences = stackOfDifferences.concat(allNeighboringDifferences);
                stackOfDifferences.shift();
            }
            nbVisitedNeighbors = nbAddedDifferences;
        }
    }

    private setAllToVisited(pixelPositions: number[]): void {
        pixelPositions.forEach((pixel: number) => {
            this.setPixelAsDifference(pixel, this.visitedColor);
        });
    }

    private getNeighboringDifferences(pixelPosition: number): number[] {

        const allNeighbors:                 number[] = this.getAllNeighbors(pixelPosition);
        const allNeighboringDifferences:    number[] = [];

        allNeighbors.forEach((neighborsPos: number) => {
            const neighborsExists:          boolean = neighborsPos !== this.DOES_NOT_EXIST;
            const neighborsIsADifference:   boolean = this.pixelIsADifference(neighborsPos);

            if (neighborsExists && neighborsIsADifference) {
                allNeighboringDifferences.push(neighborsPos);
            }
        });

        return allNeighboringDifferences;
    }

    private getAllNeighbors(pixelPosition: number): number[]  {
        const edges: IEdges = {
            isOnTopEdge:    (pixelPosition <  this.width),
            isOnBottomEdge: (pixelPosition >= this.numberOfPixelsInImage() - this.width),
            isOnLeftEdge:   (pixelPosition %  this.width === 0),
            isOnRightEdge:  (pixelPosition %  this.width === this.width - 1),
        };

        return [
            this.getTopLeftNeighborPosition     (pixelPosition, edges),
            this.getTopNeighborPosition         (pixelPosition, edges),
            this.getTopRightNeighborPosition    (pixelPosition, edges),
            this.getLeftNeighborPosition        (pixelPosition, edges),
            this.getRightNeighborPosition       (pixelPosition, edges),
            this.getBottomLeftNeighborPosition  (pixelPosition, edges),
            this.getBottomNeighborPosition      (pixelPosition, edges),
            this.getBottomRightNeighborPosition (pixelPosition, edges),
        ];
    }

    private getTopLeftNeighborPosition(pixelPosition: number, constraints: IEdges): number {
        const topLeftPos: number = pixelPosition - this.width + this.OFFSET_LEFT;

        return (!constraints.isOnTopEdge && !constraints.isOnLeftEdge) ? topLeftPos : this.DOES_NOT_EXIST;
    }

    private getTopNeighborPosition(pixelPosition: number, constraints: IEdges): number {
        const topPos: number = pixelPosition - this.width;

        return !constraints.isOnTopEdge ? topPos : this.DOES_NOT_EXIST;
    }

    private getTopRightNeighborPosition(pixelPosition: number, constraints: IEdges): number {
        const topRightPos: number = pixelPosition - this.width + this.OFFSET_RIGHT;

        return (!constraints.isOnTopEdge && !constraints.isOnRightEdge) ? topRightPos : this.DOES_NOT_EXIST;
    }

    private getLeftNeighborPosition(pixelPosition: number, constraints: IEdges): number {
        const leftPos: number = pixelPosition + this.OFFSET_LEFT;

        return !constraints.isOnLeftEdge ? leftPos : this.DOES_NOT_EXIST;
    }

    private getRightNeighborPosition(pixelPosition: number, constraints: IEdges): number {
        const rightPos: number = pixelPosition + this.OFFSET_RIGHT;

        return !constraints.isOnRightEdge ? rightPos : this.DOES_NOT_EXIST;
    }

    private getBottomLeftNeighborPosition(pixelPosition: number, constraints: IEdges): number {
        const bottomLeftPos: number = pixelPosition + this.width + this.OFFSET_LEFT;

        return (!constraints.isOnBottomEdge && !constraints.isOnLeftEdge) ? bottomLeftPos : this.DOES_NOT_EXIST;
    }

    private getBottomNeighborPosition(pixelPosition: number, constraints: IEdges): number {
        const bottomPos: number = pixelPosition + this.width;

        return !constraints.isOnBottomEdge ? bottomPos : this.DOES_NOT_EXIST;
    }

    private getBottomRightNeighborPosition(pixelPosition: number, constraints: IEdges): number {
        const bottomRightPos: number = pixelPosition + this.width + this.OFFSET_RIGHT;

        return !constraints.isOnBottomEdge && !constraints.isOnRightEdge ? bottomRightPos : this.DOES_NOT_EXIST;
    }

}
