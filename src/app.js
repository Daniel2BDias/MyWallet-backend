import express, { json } from "express";
import cors from "cors";
import {
  logOutController,
  loginController,
  signUpController,
} from "./controllers/authControllers.js";
import {
  deleteEntryController,
  listTransactionsController,
  newTransactionController,
} from "./controllers/transactionControllers.js";

const app = express();

app.use(cors());
app.use(json());

app.post("/cadastro", signUpController);

app.post("/login", loginController);

app.post("/logout/", logOutController);

app.post("/nova-transacao/:tipo", newTransactionController);

app.get("/transactions", listTransactionsController);

app.post("/delete-entry", deleteEntryController);

app.listen(process.env.PORT, () => {
  console.log(`Servidor Online! PORT: ${process.env.PORT}`);
});
