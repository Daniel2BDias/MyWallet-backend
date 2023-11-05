import dayjs from "dayjs";
import db from "../../database.js";
import { ObjectId } from "mongodb";

export const newTransactionController = async (req, res) => {
    const { type } = req.params;
    const { value, description } = req.body;
    const { token } = res.locals;
  
    if (type !== "add" && type !== "subtract") return res.sendStatus(404);
  
    try {
      const user = await db.collection("sessions").findOne({ token });
  
      if (!user) return res.sendStatus(401);
  
      await db.collection("transaction").insertOne({
        email: user.email,
        transaction: {
          value: Number(value).toFixed(2),
          description,
          type,
          date: `${dayjs().format("DD/MM")}`,
        },
      });
  
      res.sendStatus(201);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  export const listTransactionsController = async (req, res) => {
    const { token } = res.locals;
  
    try {
      const user = await db.collection("sessions").findOne({ token });
      if (!user) return res.sendStatus(404);
  
      const transactions = await db
        .collection("transaction")
        .find({ email: user.email })
        .toArray();
  
      res.status(200).send(transactions.map((t) => {
        const { _id, transaction } = t;
        return { _id, transaction };
      }));
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  export const deleteEntryController = async (req, res) => {
    const { id } = req.params;
    const { token } = res.locals;
  
    try {
      const session = await db.collection("sessions").findOne({ token });
      if (!session) return res.sendStatus(401);
      const deletion = await db
        .collection("transaction")
        .deleteOne({ _id: new ObjectId(id) });
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

    if (type !== "add" && type !== "subtract") return res.sendStatus(404);

    const user = await db.collection("sessions").findOne({ token });
  
    if (!user) return res.sendStatus(401);

    try {
      await db.collection("transaction").updateOne(
        {_id: new ObjectId(id)},
        { $set: { transaction: {
          value,
          description,
          type,
          date: `${dayjs().format("DD/MM")}`
        }}}
      );

      res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
  };