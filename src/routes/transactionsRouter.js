import { Router } from 'express';
import {
  newTransactionController,
  listTransactionsController,
  deleteEntryController,
  editEntryController,
} from '../controllers/transactionControllers.js';
import { transactionSchema } from '../schemas/transactionsSchemas.js';
import validateSchema from '../middlewares/validateSchema.js';
import validateToken from '../middlewares/validateToken.js';

const transactionsRouter = Router();

transactionsRouter.use(validateToken);

transactionsRouter.post('/nova-transacao/:type', validateSchema(transactionSchema), newTransactionController);

transactionsRouter.get('/transactions', listTransactionsController);

transactionsRouter.delete('/delete-entry/:id', deleteEntryController);

transactionsRouter.put('/edit-entry/:type/:id', validateSchema(transactionSchema), editEntryController);

export default transactionsRouter;
