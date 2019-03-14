import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Message } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";
import { Constants } from "../constants";

const SUCCESS_MESSAGE:  string = "Attente annulée";
const ERROR_MESSAGE:    string = "Impossible d'annuler l'attente";

@Component({
  selector: "app-waiting-room",
  templateUrl: "./waiting-room.component.html",
  styleUrls: ["./waiting-room.component.css"],
})
export class WaitingRoomComponent {

