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

  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(422).send(error.details.map((detail) => detail.message));

  try {
    const userByEmail = await db.collection("users").findOne({ email });
    if (!userByEmail) return res.status(404).send("Email não cadastrado!");

    const isPwValid = bcrypt.compareSync(password, userByEmail.password);
    if (!isPwValid) return res.status(401).send("Senha Incorreta!");

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor Online! PORT: ${process.env.PORT}`);
});
