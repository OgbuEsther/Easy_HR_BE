console.log("--------------------------------");
import express, { Application } from "express";
import appConfig from "./app";

import envVariables from "./config/environmentVariables";
import dbConfig from "./config/db";

const app: Application = express();
appConfig(app);
dbConfig();

app.listen(envVariables.PORT, () => {
  console.log(`server is up on port ${envVariables.PORT}`);
});


console.log("-------------------------------- : ");
console.log("-------------------------------- : ");