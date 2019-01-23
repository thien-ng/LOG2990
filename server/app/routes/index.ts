import { NextFunction, Request, Response } from "express";
import { injectable, } from "inversify";
import "reflect-metadata";
import { Message } from "../../../common/communication/message";

export module Route {

    @injectable()
    export class Index {

        public helloWorld(req: Request, res: Response, next: NextFunction): void {
            const message: Message = {
                title: "Hello",
                body: "World",
            };
            res.send(JSON.stringify(message));
        }
    }
}
