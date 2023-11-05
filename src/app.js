import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/indexRouter.js";

const app = express();

app.use(cors());
app.use(json());
app.use(router);
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor Online! PORT: ${PORT}`);
});
