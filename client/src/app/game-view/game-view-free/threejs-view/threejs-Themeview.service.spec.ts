import { inject, TestBed } from "@angular/core/testing";
import * as THREE from "three";
import {  anyNumber, mock, when } from "ts-mockito";
import { ActionType, IPosition2D, ISceneObjectUpdate } from "../../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { GameViewFreeService } from "../game-view-free.service";
import { ThreejsThemeViewService } from "./threejs-ThemeView.service";
import { ThreejsRaycast } from "./utilitaries/threejs-raycast";
import { ThreejsThemeGenerator } from "./utilitaries/threejs-themeGenerator";

// tslint:disable:no-any max-file-line-count max-line-length

const sceneVariables: ISceneVariables<IMesh> = {
  theme:                  1,
  gameName:               "gameName",
  sceneObjectsQuantity:   1,
  sceneObjects: [
    {
      name: "",
      id:         1,
      meshInfo:   {GLTFUrl: "", uuid: ""},
      position:   { x: 1, y: 1, z: 1 },
      rotation:   { x: 1, y: 1, z: 1 },
      radius:      1,
      scaleFactor: 1,
      hidden:     true,
    },
  ],
  sceneBackgroundColor: "#FFFFFF",
