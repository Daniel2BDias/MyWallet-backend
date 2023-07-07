import { Router } from "express";
import {
  newTransactionController,
  listTransactionsController,
  deleteEntryController,
} from "../controllers/transactionControllers.js";
import { transactionSchema } from "../schemas/transactionsSchemas.js";
import validateSchema from "../middlewares/validateSchema.js";

const transactionsRouter = Router();

transactionsRouter.post("/nova-transacao/:tipo", validateSchema(transactionSchema), newTransactionController);

transactionsRouter.get("/transactions", listTransactionsController);

transactionsRouter.post("/delete-entry", deleteEntryController);

export default transactionsRouter;
