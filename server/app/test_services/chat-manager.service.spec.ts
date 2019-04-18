
// import { IChatSender } from "../../../common/communication/iChat";
// import { IArenaResponse } from "../../../common/communication/iGameplay";
// import { IUser } from "../../../common/communication/iUser";
// import { ChatManagerService } from "../services/chat-manager.service";
// import { TimeManagerService } from "../services/time-manager.service";

// // tslint:disable:no-magic-numbers no-any

// let chatManagerService: ChatManagerService;
// let timeManagerService: TimeManagerService;
// let server: SocketIO.Server;

// chai.use(spies);

// const soloUser: IUser[] = [
//     {
//         username: "username",
//         socketID: "socketID",
//     },
// ];

// const multiUser: IUser[] = [
//     {
//         username: "username1",
//         socketID: "socketID1",
//     },
//     {
//         username: "username2",
//         socketID: "socketID3",
//     },
// ];

// beforeEach(() => {
//     server              = Mockito.mock(SocketIO);
//     timeManagerService  = new TimeManagerService();
//     chatManagerService  = new ChatManagerService(timeManagerService);
// });

// describe("ChatManagerService Tests", () => {

//     it ("should emit message of player login message", (done: Function) => {
//         chatManagerService["server"] = server;
//         const spy: any  = chai.spy.on(chatManagerService["server"], "emit");

//         chatManagerService.sendPlayerLogStatus("test", server, true);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

//     it ("should emit message of player logout message", (done: Function) => {
//         chatManagerService["server"] = server;
//         const spy: any  = chai.spy.on(chatManagerService["server"], "emit");

//         chatManagerService.sendPlayerLogStatus("test", server, false);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

//     it ("should emit chat message to solo arena", (done: Function) => {
//         chatManagerService["server"] = server;
//         sinon.stub(chatManagerService, "sendToSocketIDMessage").callsFake(() => {/* do nothing */});
//         const spy: any = chai.spy.on(chatManagerService, "sendToSocketIDMessage");

//         const chatSender: IChatSender = {
//             arenaID:    1,
//             username:   "username",
//             message:    "message",
//         };

//         chatManagerService.sendChatMessage(soloUser, chatSender, server);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

//     it ("should emit chat message to multi arena", (done: Function) => {
//         chatManagerService["server"] = server;
//         sinon.stub(chatManagerService, "sendToSocketIDMessage").callsFake(() => {/* do nothing */});
//         const spy: any = chai.spy.on(chatManagerService, "sendToSocketIDMessage");

//         const chatSender: IChatSender = {
//             arenaID:    1,
//             username:   "username",
//             message:    "message",
//         };

//         chatManagerService.sendChatMessage(multiUser, chatSender, server);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

//     it ("should emit highscore message single mode and first position", (done: Function) => {
//         chatManagerService["server"] = server;
//         const spy: any  = chai.spy.on(chatManagerService["server"], "emit");

//         chatManagerService.sendNewHighScoreMessage(
//             "username", 0, "gameName", 0, server);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

//     it ("should emit highscore message single mode and second position", (done: Function) => {
//         chatManagerService["server"] = server;
//         const spy: any  = chai.spy.on(chatManagerService["server"], "emit");

//         chatManagerService.sendNewHighScoreMessage(
//             "username", 0, "gameName", 1, server);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

//     it ("should emit highscore message single mode and third position", (done: Function) => {
//         chatManagerService["server"] = server;
//         const spy: any  = chai.spy.on(chatManagerService["server"], "emit");

//         chatManagerService.sendNewHighScoreMessage(
//             "username", 0, "gameName", 2, server);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

//     it ("should emit highscore message multi mode and first position", (done: Function) => {
//         chatManagerService["server"] = server;
//         const spy: any  = chai.spy.on(chatManagerService["server"], "emit");

//         chatManagerService.sendNewHighScoreMessage(
//             "username", 1, "gameName", 0, server);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

//     it ("should emit highscore message multi mode and second position", (done: Function) => {
//         chatManagerService["server"] = server;
//         const spy: any  = chai.spy.on(chatManagerService["server"], "emit");

//         chatManagerService.sendNewHighScoreMessage(
//             "username", 1, "gameName", 1, server);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

//     it ("should emit highscore message multi mode and third position", (done: Function) => {
//         chatManagerService["server"] = server;
//         const spy: any  = chai.spy.on(chatManagerService["server"], "emit");

//         chatManagerService.sendNewHighScoreMessage(
//             "username", 1, "gameName", 2, server);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

//     it ("should emit message of position validation if wrong hit in solo mode", (done: Function) => {

//         chatManagerService["server"] = server;
//         sinon.stub(chatManagerService, "sendToSocketIDMessage").callsFake(() => {/* do nothing */});
//         const spy: any = chai.spy.on(chatManagerService, "sendToSocketIDMessage");

//         const test: IArenaResponse<any> = {
//             status: "wrongHit",
//             response: {
//                 differenceKey: 1,
//                 cluster: [
//                     {
//                         color:    {R: 1, G: 1, B: 1},
//                         position: {x: 1, y: 1},
//                     },
//                 ],
//             },
//         };
//         chatManagerService.sendPositionValidationMessage("username", soloUser, test, server);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

//     it ("should emit message of position validation if good hit in solo mode", (done: Function) => {

//         chatManagerService["server"] = server;
//         sinon.stub(chatManagerService, "sendToSocketIDMessage").callsFake(() => {/* do nothing */});
//         const spy: any = chai.spy.on(chatManagerService, "sendToSocketIDMessage");

//         const test: IArenaResponse<any> = {
//             status: "onSuccess",
//             response: {
//                 differenceKey: 1,
//                 cluster: [
//                     {
//                         color:    {R: 1, G: 1, B: 1},
//                         position: {x: 1, y: 1},
//                     },
//                 ],
//             },
//         };
//         chatManagerService.sendPositionValidationMessage("username", soloUser, test, server);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

//     it ("should emit message of position validation if wrong hit in multi mode", (done: Function) => {

//         chatManagerService["server"] = server;
//         sinon.stub(chatManagerService, "sendToSocketIDMessage").callsFake(() => {/* do nothing */});
//         const spy: any = chai.spy.on(chatManagerService, "sendToSocketIDMessage");

//         const test: IArenaResponse<any> = {
//             status: "wrongHit",
//             response: {
//                 differenceKey: 1,
//                 cluster: [
//                     {
//                         color:    {R: 1, G: 1, B: 1},
//                         position: {x: 1, y: 1},
//                     },
//                 ],
//             },
//         };
//         chatManagerService.sendPositionValidationMessage("username", multiUser, test, server);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

//     it ("should emit message of position validation if good hit in multi mode", (done: Function) => {

//         chatManagerService["server"] = server;
//         sinon.stub(chatManagerService, "sendToSocketIDMessage").callsFake(() => {/* do nothing */});
//         const spy: any = chai.spy.on(chatManagerService, "sendToSocketIDMessage");

//         const test: IArenaResponse<any> = {
//             status: "onSuccess",
//             response: {
//                 differenceKey: 1,
//                 cluster: [
//                     {
//                         color:    {R: 1, G: 1, B: 1},
//                         position: {x: 1, y: 1},
//                     },
//                 ],
//             },
//         };
//         chatManagerService.sendPositionValidationMessage("username", multiUser, test, server);

//         chai.expect(spy).to.have.been.called();
//         done();
//     });

// });
