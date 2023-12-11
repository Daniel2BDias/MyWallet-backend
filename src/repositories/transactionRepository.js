import { ObjectId } from 'mongodb';
import db from '../database/database.js';

export const createTransaction = async (user, value, stripDescription, type) => {
  return await db.collection('transaction').insertOne({
    email: user.email,
    transaction: {
      value: Number(value).toFixed(2),
      description: stripDescription.result,
      type,
      date: `${dayjs().format('DD/MM')}`,
    },
  });
};

export const retrieveTransactions = async (user) => {
  return await db.collection('transaction').find({ email: user.email }).toArray();
};

export const deleteTransaction = async (id) => {
  return await db.collection('transaction').deleteOne({ _id: new ObjectId(id) });
};

export const editTransaction = async (id, value, stripDescription, type) => {
  return await db.collection('transaction').updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        transaction: {
          value: Number(value).toFixed(2),
          description: stripDescription.result,
          type,
          date: `${dayjs().format('DD/MM')}`,
        },
      },
    },
  );
};
