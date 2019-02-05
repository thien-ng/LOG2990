interface IEdges {
    isOnTopEdge: boolean;
    isOnBottomEdge: boolean;
    isOnLeftEdge: boolean;
    isOnRightEdge: boolean;
}

export class ClusterCounter {

    private readonly DECALAGE_GAUCHE: number = -1;
    private readonly DECALAGE_DROITE: number = 1;
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

        let stackOfDifferences: number[] = [position];
        let nbAddedDifferences: number = 1;
        let nbVisitedNeighbors: number = 1;
        this.differenceList[position] = 0;

        while (!(stackOfDifferences.length === 0)) {

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
