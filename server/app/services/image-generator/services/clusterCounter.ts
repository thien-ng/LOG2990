interface IEdges {
    isOnTopEdge: boolean;
    isOnBottomEdge: boolean;
    isOnLeftEdge: boolean;
    isOnRightEdge: boolean;
}

export class ClusterCounter {

    private readonly IS_VISITED: number = 2;
    private readonly IS_A_DIFFERENCE: number = 1;
    private readonly DOES_NOT_EXIST: number = -1;

    public constructor(public differenceList: number[], public width: number) {
        // default constructor
    }

    public countAllClusters(): number {

        let clusterCounter: number = 0;
        let indexInList: number = 0;

        this.differenceList.forEach((value: number) => {

            if (value === this.IS_A_DIFFERENCE) {
                this.findAllConnectedDifferences(indexInList);
                clusterCounter++;
            }
            indexInList++;
        });

        return clusterCounter;
    }

    private findAllConnectedDifferences(position: number): void {

        this.differenceList[position] = this.IS_VISITED;
        const neighborsPosition: number[] = this.getAllNeighborsPosition(position);

        neighborsPosition.forEach((neighborsPos: number) => {
            if (neighborsPos !== this.DOES_NOT_EXIST) {
                if (this.differenceList[neighborsPos] === this.IS_A_DIFFERENCE) {
                    this.findAllConnectedDifferences(neighborsPos);
                }
            }
        });
    }

    private getAllNeighborsPosition(position: number): number[] {

        const edges: IEdges = {
            isOnTopEdge: (position < this.width),
            isOnBottomEdge: (position >= this.differenceList.length - this.width),
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
        const topLeftPos: number = position - this.width - 1;

        return (!constraints.isOnTopEdge && !constraints.isOnLeftEdge) ? topLeftPos : -1;
    }

    private getTopNeighborPosition(position: number, constraints: IEdges): number {
        const topPos: number = position - this.width;

        return !constraints.isOnTopEdge ? topPos : -1;
    }

    private getTopRightNeighborPosition(position: number, constraints: IEdges): number {
        const topRightPos: number = position - this.width + 1;

        return (!constraints.isOnTopEdge && !constraints.isOnRightEdge) ? topRightPos : -1;
    }

    private getLeftNeighborPosition(position: number, constraints: IEdges): number {
        const leftPos: number = position - 1;

        return !constraints.isOnLeftEdge ? leftPos : -1;
    }

    private getRightNeighborPosition(position: number, constraints: IEdges): number {
        const rightPos: number = position + 1;

        return !constraints.isOnRightEdge ? rightPos : -1;
    }

    private getBottomLeftNeighborPosition(position: number, constraints: IEdges): number {
        const bottomLeftPos: number = position + this.width - 1;

        return (!constraints.isOnBottomEdge && !constraints.isOnLeftEdge) ? bottomLeftPos : -1;
    }

    private getBottomNeighborPosition(position: number, constraints: IEdges): number {
        const bottomPos: number = position + this.width;

        return !constraints.isOnBottomEdge ? bottomPos : -1;
    }

    private getBottomRightNeighborPosition(position: number, constraints: IEdges): number {
        const bottomRightPos: number = position + this.width + 1;

        return !constraints.isOnBottomEdge && !constraints.isOnRightEdge ? bottomRightPos : -1;
    }

}
