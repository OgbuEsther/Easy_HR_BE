import express from "express";
import ip from "ip";
import axios from "axios";
import { SuperfaceClient } from "@superfaceai/one-sdk";
const app = express();
app.set("trust proxy", true);

const sdk = new SuperfaceClient();

async function run(ip: any) {
  // Load the profile
  const profile = await sdk.getProfile("address/ip-geolocation@1.0.1");

  // Use the profile
  const result = await profile.getUseCase("IpGeolocation").perform(
    {
      //   ipAddress: "102.88.34.40",
      ipAddress: ip,
    },
    {
      provider: "ipdata",
      security: {
        apikey: {
          apikey: "41b7b0ed377c175c4b32091abd68d049f5b6b748b2bee4789a161d93",
        },
      },
    },
  );

  // Handle the result
  try {
    const data = result.unwrap();
    return data;
  } catch (error) {
    console.error(error);
  }
}

app.get("/", async (req, res) => {
  let dataIP: any;
  await axios
    .get("https://api.ipify.org/")
    .then((res) => {
      //   console.log("reading data: ", res.data);
      dataIP = res.data;
    })
    .catch((err) => {
      console.log(err);
    });

  res.send(await run(dataIP));
});

app.get("/ip", async (req, res) => {
  res.end("Your IP address is " + ip.address());
});

app.listen(3022, () => {
  console.log("SERVER RUNNIHG AT PORT 3000");
});