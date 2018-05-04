import express from "express";
import * as bodyParser from "body-parser";
import { getLinksRouter } from "./src/backend/controllers/link_controller";
import { getAuthRouter } from "./src/backend/controllers/auth_controller";
import { getUserRouter } from "./src/backend/controllers/user_controller";

export async function getApp() {

    // Create express app
    const app = express();

    // Configure body parser middleware so we can send JSON
    // data in the HTTP requests
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Configure controllers
    app.use("/api/v1/links", getLinksRouter());
    app.use("/api/v1/auth", getAuthRouter());
    app.use("/api/v1/users", getUserRouter);


    return app;
}
