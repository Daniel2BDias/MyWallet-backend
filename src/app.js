import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const app = express();

app.use(cors());
app.use(json());
dotenv.config();
let db;

try {
  const mongoClient = new MongoClient(process.env.DATABASE_URL);
  await mongoClient.connect();
  db = mongoClient.db("mywallet");
} catch (error) {
  console.log(error.message);
}

const signUpSchema = joi.object().keys({
  name: joi.string().alphanum().required(),
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
});

const loginSchema = joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
});

app.post("/cadastro", async (req, res) => {
  const { name, email, password } = req.body;

  const { error } = signUpSchema.validate(req.body, { abortEarly: false });
  if (error)
    return res.status(422).send(error.details.map((detail) => detail.message));

  try {
    const alreadySignedEmail = await db.collection("users").findOne({ email });

    if (alreadySignedEmail) return res.sendStatus(409);

    const hashedPw = bcrypt.hashSync(password, 10);

    await db.collection("users").insertOne({ ...req.body, password: hashedPw });

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await db.collection("users").findOne({ email });
    if (!existingUser) return res.sendStatus(404);
    const pWordValid = bcrypt.compareSync(password, existingUser.password);
    if (!pWordValid) return res.sendStatus(401);

    const token = uuid();
    
    const inSession = await db.collection("sessions").findOne({ email });
    if(inSession) return res.status(409).send("Already in Session! Please, logout");

    await db.collection("sessions").insertOne({ token, email });

    res.status(201).send({token, email, name: existingUser.name});
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/", () => {});

app.listen(process.env.PORT, () => {
  console.log(`Servidor Online! PORT: ${process.env.PORT}`);
});
