console.log("--------------------------------");
import express, { Application } from "express";
import appConfig from "./app";
import dbConfig from "./config/db";
import envVariables from "./config/environmentVariables";

const app: Application = express();
appConfig(app);
dbConfig();

app.listen(envVariables.PORT, () => {
  console.log(`server is up on port ${envVariables.PORT}`);
});
