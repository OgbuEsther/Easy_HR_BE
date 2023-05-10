"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ip_1 = __importDefault(require("ip"));
const axios_1 = __importDefault(require("axios"));
const one_sdk_1 = require("@superfaceai/one-sdk");
const app = (0, express_1.default)();
app.set("trust proxy", true);
const sdk = new one_sdk_1.SuperfaceClient();
function run(ip) {
    return __awaiter(this, void 0, void 0, function* () {
        // Load the profile
        const profile = yield sdk.getProfile("address/ip-geolocation@1.0.1");
        // Use the profile
        const result = yield profile.getUseCase("IpGeolocation").perform({
            //   ipAddress: "102.88.34.40",
            ipAddress: ip,
        }, {
            provider: "ipdata",
            security: {
                apikey: {
                    apikey: "41b7b0ed377c175c4b32091abd68d049f5b6b748b2bee4789a161d93",
                },
            },
        });
        // Handle the result
        try {
            const data = result.unwrap();
            return data;
        }
        catch (error) {
            console.error(error);
        }
    });
}
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let dataIP;
    yield axios_1.default
        .get("https://api.ipify.org/")
        .then((res) => {
        //   console.log("reading data: ", res.data);
        dataIP = res.data;
    })
        .catch((err) => {
        console.log(err);
    });
    res.send(yield run(dataIP));
}));
app.get("/ip", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.end("Your IP address is " + ip_1.default.address());
}));
app.listen(3022, () => {
    console.log("SERVER RUNNIHG AT PORT 3000");
});
