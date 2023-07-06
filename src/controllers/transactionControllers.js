import { transactionSchema } from "./schemas/transactionsSchemas.js";
import dayjs from "dayjs";

export const newTransactionController = async (req, res) => {
    const { authorization } = req.headers;
    const { tipo } = req.params;
    const { value, description } = req.body;
  
    const { error } = transactionSchema.validate(req.body, { abortEarly: false });
    if (error) return res.sendStatus(422);
  
    if (tipo !== "add" && tipo !== "subtract") return res.sendStatus(404);
  
    const token = authorization?.replace("Bearer ", "");
  
    if (!token) return res.sendStatus(401);
  
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
    const { authorization } = req.headers;
  
    const token = authorization?.replace("Bearer ", "");
  
    if (!token) return res.sendStatus(401);
  
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
    const { authorization } = req.headers;
    const { transaction } = req.body;
    const token = authorization?.replace("Bearer ", "");
  
    try {
      const session = await db.collection("sessions").findOne({ token });
      if (!session) return res.sendStatus(401);
      const deletion = await db
        .collection("transaction")
        .deleteOne({ transaction });
      if (deletion.deleteCount === 0) return res.sendStatus(404);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };