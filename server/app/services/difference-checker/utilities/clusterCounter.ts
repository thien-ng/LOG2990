interface IEdges {
    isOnTopEdge:    boolean;
    isOnBottomEdge: boolean;
    isOnLeftEdge:   boolean;
    isOnRightEdge:  boolean;
}

export class ClusterCounter {

    private readonly BMP_HEADER_SIZE: number = 54;  // a mettre dans les constantes
    private readonly PIXEL_SIZE:      number = 3;   // a mettre dans les constantes

    private readonly DECALAGE_GAUCHE: number = -1;
    private readonly DECALAGE_DROITE: number =  1;
    private readonly DOES_NOT_EXIST:  number = -1;   // a mettre dans les constantes
    private readonly IS_A_DIFFERENCE: number =  0;   // a mettre dans les constantes

    private visitedColor: number = 1;

    public constructor(public differenceBuffer: Buffer, public width: number) { /* */ }

    public countAllClusters(): number {

        let clusterCounter: number = 0;

        for (let bytePos: number = this.BMP_HEADER_SIZE; bytePos < this.differenceBuffer.length; bytePos += this.PIXEL_SIZE) {
            if (this.differenceBuffer[bytePos] === this.IS_A_DIFFERENCE) {

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
            return Math.floor(bytePosition / this.PIXEL_SIZE);
        }

        // will only work with an image that's a width multiple of 4
    private convertToBytePosition(pixelPosition: number): number {
            return pixelPosition * this.PIXEL_SIZE;
        }

    private findAllConnectedDifferences(position: number): void {

        let stackOfDifferences: number[] = [position];
        let nbAddedDifferences: number = 1;
        let nbVisitedNeighbors: number = 1;
        this.differenceBuffer[position] = 0;

        while (stackOfDifferences.length !== 0) {

            let allNeighboringDifferences: number[];
            nbAddedDifferences = 0;

            for (let i: number = 0; i < nbVisitedNeighbors; i++) {
                const currentDifference: number = stackOfDifferences[0];
                allNeighboringDifferences = this.getNeighboringDifferences(currentDifference);
                this.setAllToVisited(allNeighboringDifferences);
                nbAddedDifferences += allNeighboringDifferences.length;
                stackOfDifferences = stackOfDifferences.concat(allNeighboringDifferences);
                stackOfDifferences.shift();
            }
            nbVisitedNeighbors = nbAddedDifferences;
        }
    }

    private setAllToVisited(positions: number[]): void {
        positions.forEach((position: number) => {
            this.differenceBuffer[position] = this.IS_VISITED;
        });
    }

    private getNeighboringDifferences(position: number): number[] {

        const allNeighbors: number[] = this.getAllNeighbors(position);
        const allNeighboringDifferences: number[] = [];

        allNeighbors.forEach((neighborsPos: number) => {
            const neighborsExists: boolean = neighborsPos !== this.DOES_NOT_EXIST;
            const neighborsIsADifference: boolean = this.differenceBuffer[neighborsPos] === this.IS_A_DIFFERENCE;

            if (neighborsExists && neighborsIsADifference) {
                allNeighboringDifferences.push(neighborsPos);
            }
        });

        return allNeighboringDifferences;
    }

    private getAllNeighbors(position: number): number[]  {
        const edges: IEdges = {
            isOnTopEdge: (position < this.width),
            isOnBottomEdge: (position >= this.differenceBuffer.length - this.width),
            isOnLeftEdge: (position % this.width === 0),
            isOnRightEdge: (position % this.width === this.width - 1),
        };

        return [
            this.getTopLeftNeighborPosition(position, edges),
            this.getTopNeighborPosition(position, edges),
            this.getTopRightNeighborPosition(position, edges),
            this.getLeftNeighborPosition(position, edges),
            this.getRightNeighborPosition(position, edges),
            this.getBottomLeftNeighborPosition(position, edges),
            this.getBottomNeighborPosition(position, edges),
            this.getBottomRightNeighborPosition(position, edges),
        ];
    }

    private getTopLeftNeighborPosition(position: number, constraints: IEdges): number {
        const topLeftPos: number = position - this.width + this.DECALAGE_GAUCHE;

        return (!constraints.isOnTopEdge && !constraints.isOnLeftEdge) ? topLeftPos : this.DOES_NOT_EXIST;
    }

    private getTopNeighborPosition(position: number, constraints: IEdges): number {
        const topPos: number = position - this.width;

        return !constraints.isOnTopEdge ? topPos : this.DOES_NOT_EXIST;
    }

    private getTopRightNeighborPosition(position: number, constraints: IEdges): number {
        const topRightPos: number = position - this.width + this.DECALAGE_DROITE;

        return (!constraints.isOnTopEdge && !constraints.isOnRightEdge) ? topRightPos : this.DOES_NOT_EXIST;
    }

    private getLeftNeighborPosition(position: number, constraints: IEdges): number {
        const leftPos: number = position + this.DECALAGE_GAUCHE;

        return !constraints.isOnLeftEdge ? leftPos : this.DOES_NOT_EXIST;
    }

    private getRightNeighborPosition(position: number, constraints: IEdges): number {
        const rightPos: number = position + this.DECALAGE_DROITE;

        return !constraints.isOnRightEdge ? rightPos : this.DOES_NOT_EXIST;
    }

    private getBottomLeftNeighborPosition(position: number, constraints: IEdges): number {
        const bottomLeftPos: number = position + this.width + this.DECALAGE_GAUCHE;

        return (!constraints.isOnBottomEdge && !constraints.isOnLeftEdge) ? bottomLeftPos : this.DOES_NOT_EXIST;
    }

    private getBottomNeighborPosition(position: number, constraints: IEdges): number {
        const bottomPos: number = position + this.width;

        return !constraints.isOnBottomEdge ? bottomPos : this.DOES_NOT_EXIST;
    }

    private getBottomRightNeighborPosition(position: number, constraints: IEdges): number {
        const bottomRightPos: number = position + this.width + this.DECALAGE_DROITE;

        return !constraints.isOnBottomEdge && !constraints.isOnRightEdge ? bottomRightPos : this.DOES_NOT_EXIST;
    }

}
