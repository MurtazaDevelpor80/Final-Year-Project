import express from "express";
import bodyParser from "body-parser";
import * as RESPONSE from "./src/utils/response.js";
import router from "./src/router/index.js";
import { verifyToken } from "./src/middleWare/authenticate.js";
import { admin } from "./firebaseConfig.js";
import cors from "cors";
const URL =
  "mongodb+srv://alibooka5:LkyA1ZAiQhDOLLwZ@cluster0.lhs4d9t.mongodb.net/";
import mongoose from "mongoose";

mongoose
  .connect(URL)
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
    }
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(process.env.PORT || 3001, () => {
  console.log(`listning on ${process.env.PORT || 3001}`);
});

//extend request timeout to 5 minutes

app.use((req, res, next) => {
  res.setTimeout(5 * 60 * 1000, () => {
    console.log("Request has timed out.");
    res.send(408);
  });
  next();
});

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.send();
});

app.use(express.static("public"));
app.use("/api", verifyToken, router);

app.all("*", function (req, res) {
  return RESPONSE.onNotFound(res, "Resource Not Found" + req.url);
});
