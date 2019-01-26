import { expect } from "chai";
import "reflect-metadata";

import { NameValidatorService } from "../../../app/validator/NameValidatorService";

it("should return True if name input is unique", (done :Function) =>{
    const nameValidatorService = new NameValidatorService();
    const name: String = "patate";
    const result = nameValidatorService.validateName(name);

    expect(result).to.be.true;
    done();
});

it("should return False if name input is not unique", (done :Function) =>{
    const nameValidatorService = new NameValidatorService();
    const name: String = "patate";
    nameValidatorService.getNameList().push(name);
    const result = nameValidatorService.validateName(name);

    expect(result).to.be.false;
    done();
});

it("should return True if name is cleared from list properly", (done :Function) =>{
    const nameValidatorService = new NameValidatorService();
    const name: String = "patate";
    nameValidatorService.getNameList().push(name);
    nameValidatorService.leaveBrowser(name);

    const result = nameValidatorService.isUnique(name);
    expect(result).to.be.true;
    done();
});
