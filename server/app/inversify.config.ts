import { Container } from "inversify";
import { Application } from "./app";
import { Routes } from "./routes";
import { Route } from "./routes/index";
import { Server } from "./server";
import Types from "./types";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);

container.bind(Types.Index).to(Route.Index);

export { container };
