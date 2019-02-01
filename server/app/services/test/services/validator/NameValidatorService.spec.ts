import { expect } from "chai";
import "reflect-metadata";
import { NameValidatorService } from "../../../validator/nameValidator.service";

let nameValidatorService: NameValidatorService;

beforeEach(() => {
    nameValidatorService = new NameValidatorService;
    nameValidatorService.getNameList().push("patate");
    nameValidatorService.getNameList().push("roger");
    nameValidatorService.getNameList().push("dylan");
});

describe("NameValidatorService test", () => {

    it ("should return True if name input is unique", (done: Function) => {
        const name: String = "ligma";
        const result: Boolean = nameValidatorService.validateName(name);

        expect(result).to.equal(true);
        done();
    });

    it ("should return False if name input is not unique", (done: Function) => {
        const name: String = "patate";
        const result: Boolean = nameValidatorService.validateName(name);

        expect(result).to.equal(false);
        done();
    });

    it ("should return True if name input is unique", (done: Function) => {
        const name: String = "bob";
        const result: Boolean = nameValidatorService.isUnique(name);

        expect(result).to.equal(true);
        done();
    });

    it ("should return false if name input is unique", (done: Function) => {
        const name: String = "patate";
        const result: Boolean = nameValidatorService.isUnique(name);

        expect(result).to.equal(false);
        done();
    });

    it ("should return True if name is cleared from list properly", (done: Function) => {
        const name: String = "patate";
        nameValidatorService.leaveBrowser(name);

        const result: Boolean = nameValidatorService.isUnique(name);
        expect(result).to.equal(true);
        done();
    });

    it ("should return True if list was empty initially", (done: Function) => {
        const name: String = "patate";
        nameValidatorService.leaveBrowser(name);

        const result: Boolean = nameValidatorService.isUnique(name);
        expect(result).to.equal(true);
        done();
    });

});
