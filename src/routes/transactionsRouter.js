import { Router } from "express";
import {
  newTransactionController,
  listTransactionsController,
  deleteEntryController,
} from "../controllers/transactionControllers.js";
import { transactionSchema } from "../schemas/transactionsSchemas.js";
import validateSchema from "../middlewares/validateSchema.js";
import validateToken from "../middlewares/validateToken.js";

const transactionsRouter = Router();

transactionsRouter.post("/nova-transacao/:tipo", validateToken, validateSchema(transactionSchema), newTransactionController);

transactionsRouter.get("/transactions", validateToken, listTransactionsController);

transactionsRouter.post("/delete-entry", validateToken, deleteEntryController);

export default transactionsRouter;
