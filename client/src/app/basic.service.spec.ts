import { BasicService } from "./basic.service";
import { Message } from "../../../common/communication/message";
import { TestHelper } from "../test.helper";

// tslint:disable-next-line:no-any Used to mock the http call
let httpClientSpy: any;
let basicService: BasicService;

describe("BasicService", () => {

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
        basicService = new BasicService(httpClientSpy);
    });

    it("should return expected message (HttpClient called once)", () => {
        const expectedMessage: Message = { body: "Hello", title: "World" };

        httpClientSpy.get.and.returnValue(TestHelper.asyncData(expectedMessage));

        // check the content of the mocked call
        basicService.basicGet().subscribe(
            (response: Message) => {
                expect(response.title).toEqual(expectedMessage.title, "Title check");
                expect(response.body).toEqual(expectedMessage.body, "body check");
            },
            fail
        );

        // check if only one call was made
        expect(httpClientSpy.get.calls.count()).toBe(1, "one call");
    });
});
