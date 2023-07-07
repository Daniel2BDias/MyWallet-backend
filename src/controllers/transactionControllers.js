import dayjs from "dayjs";
import db from "../../database.js";

export const newTransactionController = async (req, res) => {
    const { tipo } = req.params;
    const { value, description } = req.body;
    const token = res.locals.token;
  
    if (tipo !== "add" && tipo !== "subtract") return res.sendStatus(404);
  
    try {
      const user = await db.collection("sessions").findOne({ token });
  
      if (!user) return res.send(401);
  
      await db.collection("transaction").insertOne({
        email: user.email,
        transaction: {
          value: Number(value).toFixed(2),
          description,
          type: tipo,
          date: `${dayjs().format("DD/MM")}`,
        },
      });
  
      res.sendStatus(201);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  export const listTransactionsController = async (req, res) => {
    const token = res.locals.token;
  
    try {
      const user = await db.collection("sessions").findOne({ token });
      if (!user) return res.sendStatus(404);
  
      const transaction = await db
        .collection("transaction")
        .find({ email: user.email })
        .toArray();
  
      res.status(200).send(transaction.map((t) => t.transaction));
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  export const deleteEntryController = async (req, res) => {
    const { transaction } = req.body;
    const token = res.locals.token;
  
    try {
      const session = await db.collection("sessions").findOne({ token });
      if (!session) return res.sendStatus(401);
      const deletion = await db
        .collection("transaction")
        .deleteOne({ transaction });
      if (deletion.deletedCount === 0) return res.sendStatus(404);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };