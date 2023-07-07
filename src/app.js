import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/indexRouter.js";

const app = express();

app.use(cors());
app.use(json());
app.use(router);
dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`Servidor Online! PORT: ${process.env.PORT}`);
});
