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

});
