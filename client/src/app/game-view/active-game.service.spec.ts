import { TestBed } from "@angular/core/testing";

import { GameMode, ICard } from "../../../../common/communication/iCard";
import { Constants } from "../constants";
import { ActiveGameService } from "./active-game.service";

fdescribe("ActiveGameService Test", () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  const activeGameService: ActiveGameService = new ActiveGameService();
  const card: ICard = {
    gameID: 12,
    title: "string",
    subtitle: "string",
    avatarImageUrl: "string",
    gameImageUrl: "string",
    gamemode: GameMode.simple,
  };

  it("should be created", () => {
    const service: ActiveGameService = TestBed.get(ActiveGameService);
    expect(service).toBeTruthy();
  });
  it("should return the path of the original image", () => {
    activeGameService.activeGame = card;
    const imgPath: string = card.gameImageUrl;
    expect(activeGameService.originalImage).toEqual(imgPath);
  });
  it("should return the path of the modified image", () => {
    activeGameService.activeGame = card;
    const imgPath: string = Constants.PATH_TO_IMAGES + "/" + card.gameID + Constants.MODIFIED_FILE;
    expect(activeGameService.modifiedImage).toEqual(imgPath);
  });
});
