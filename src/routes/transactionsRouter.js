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

transactionsRouter.use(validateToken);

transactionsRouter.post("/nova-transacao/:tipo", validateSchema(transactionSchema), newTransactionController);

transactionsRouter.get("/transactions", listTransactionsController);

transactionsRouter.delete("/delete-entry", deleteEntryController);

export default transactionsRouter;
