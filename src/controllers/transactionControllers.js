import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import { stripHtml } from 'string-strip-html';
import db from '../database/database.js';
import { checkForToken } from '../repositories/authRepository.js';
import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  retrieveTransactions,
} from '../repositories/transactionRepository.js';

export const newTransactionController = async (req, res) => {
  const { type } = req.params;
  const { value, description } = req.body;
  const { token } = res.locals;
  const stripDescription = stripHtml(description);

  if (type !== 'add' && type !== 'subtract') return res.sendStatus(404);

  try {
    const user = await checkForToken(token);
    if (!user) return res.sendStatus(401);
    await createTransaction(user, value, stripDescription, type);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const listTransactionsController = async (req, res) => {
  const { token } = res.locals;

  try {
    const user = await checkForToken(token);
    if (!user) return res.sendStatus(404);
    const transactions = await retrieveTransactions(user);
    res.status(200).send(
      transactions.map((t) => {
        const { _id, transaction } = t;
        return { _id, transaction };
      }),
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deleteEntryController = async (req, res) => {
  const { id } = req.params;
  const { token } = res.locals;

  try {
    const session = await checkForToken(token);
    if (!session) return res.sendStatus(401);
    const deletion = await deleteTransaction(id);
    if (deletion.deletedCount === 0) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const editEntryController = async (req, res) => {
  const { type, id } = req.params;
  const { value, description } = req.body;
  const { token } = res.locals;

  const stripDescription = stripHtml(description);

  if (type !== 'add' && type !== 'subtract') return res.sendStatus(404);

  const user = checkForToken(token);
  if (!user) return res.sendStatus(401);

  try {
    await editTransaction(id, value, stripDescription, type);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
