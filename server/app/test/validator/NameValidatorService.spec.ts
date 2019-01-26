import { expect } from "chai";
import "reflect-metadata";

import { NameValidatorService } from "../../../app/services/validator/NameValidatorService";

function initSetup(validatorService: NameValidatorService): void{
    
}

it("for: validateName, should return True if name input is unique", (done :Function) =>{
    const nameValidatorService = new NameValidatorService();
    const name: String = "patate";
    const result = nameValidatorService.validateName(name);

    expect(result).to.be.true;
    done();
});

it("for: validateName, should return False if name input is not unique", (done :Function) =>{
    const nameValidatorService = new NameValidatorService();
    const name: String = "patate";
    nameValidatorService.getNameList().push(name);
    const result = nameValidatorService.validateName(name);

    expect(result).to.be.false;
    done();
});

it("for: isUnique,should return True if name input is unique", (done :Function) =>{
    const nameValidatorService = new NameValidatorService();
    const name: String = "patate";
    const result = nameValidatorService.isUnique(name);

    expect(result).to.be.true;
    done();
});

it("for: isUnique,should return false if name input is unique", (done :Function) =>{
    const nameValidatorService = new NameValidatorService();
    const name: String = "patate";
    nameValidatorService.getNameList().push(name);
    const result = nameValidatorService.isUnique(name);

    expect(result).to.be.false;
    done();
});

it("for: leaveBrowser, should return True if name is cleared from list properly", (done :Function) =>{
    const nameValidatorService = new NameValidatorService();
    const name: String = "patate";
    nameValidatorService.getNameList().push(name);
    nameValidatorService.getNameList().push("roger");
    nameValidatorService.leaveBrowser(name);

    const result = nameValidatorService.isUnique(name);
    expect(result).to.be.true;
    done();
});

it("for: leaveBrowser, should return True if list was empty initially", (done :Function) =>{
    const nameValidatorService = new NameValidatorService();
    const name: String = "patate";
    nameValidatorService.leaveBrowser(name);

    const result = nameValidatorService.isUnique(name);
    expect(result).to.be.true;
    done();
});

