import "reflect-metadata";

import { expect } from "chai";
import { IOriginalPixelCluster } from "../../../../../common/communication/iGameplay";
import { BMPBuilder } from "../../../services/difference-checker/utilities/bmpBuilder";
import { DifferencesExtractor } from "../../../services/game/arena/differencesExtractor";

// tslint:disable:no-magic-numbers

const expectedPixelClusters: IOriginalPixelCluster = {
        differenceKey:  1,
        cluster: [
            {
                color: {
                    R: 100,
                    G: 100,
                    B: 100,
                },
                position: {
                    x: 1,
                    y: 1,
                },
            },
        ],
    };

let differencesExtractor: DifferencesExtractor;

beforeEach(() => {
    differencesExtractor = new DifferencesExtractor();
});

describe("Differences extractor tests", () => {

    it("should create an instance of difference extractor", () => {
        expect(new DifferencesExtractor()).instanceOf(DifferencesExtractor);
    });

    it("should extract the differences", () => {

        const builder:          BMPBuilder  = new BMPBuilder(4, 4, 100);
        const bufferOriginal:   Buffer      = Buffer.from(builder.buffer);
        builder.setColorAtPos(1, 1, 1, 1, 1);

        const bufferDifferences:    Buffer = Buffer.from(builder.buffer);
        let result:                 Map<number, IOriginalPixelCluster>;

        result = differencesExtractor.extractPixelClustersFrom(bufferOriginal, bufferDifferences);

        expect(result.get(1)).to.deep.equal(expectedPixelClusters);
    });
});
