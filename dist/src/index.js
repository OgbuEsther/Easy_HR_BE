"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("--------------------------------");
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const environmentVariables_1 = __importDefault(require("./config/environmentVariables"));
const app = (0, express_1.default)();
(0, app_1.default)(app);
(0, db_1.default)();
app.listen(environmentVariables_1.default.PORT, () => {
    console.log(`server is up on port ${environmentVariables_1.default.PORT}`);
});
console.log("-------------------------------- : ");
console.log("-------------------------------- : ");
