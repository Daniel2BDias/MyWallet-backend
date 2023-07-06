import db from "../../database.js";
import { signUpSchema, loginSchema } from "../schemas/authSchemas.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";


export const signUpController = async (req,res) => {
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
  };

  export const loginController = async (req, res) => {
    const { email, password } = req.body;
  
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
  
    if (error)
      return res.status(422).send(error.details.map((detail) => detail.message));
  
    try {
      const existingUser = await db.collection("users").findOne({ email });
      if (!existingUser) return res.sendStatus(404);
      const pWordValid = bcrypt.compareSync(password, existingUser.password);
      if (!pWordValid) return res.sendStatus(401);
  
      const token = uuid();
  
      const inSession = await db.collection("sessions").findOne({ email });
      if (inSession)
        return res.status(409).send("Already in Session! Please, Log Out");
  
      await db.collection("sessions").insertOne({ token, email });
  
      res.status(200).send({ token, email, name: existingUser.name });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  export const logOutController = async (req, res) => {
    const { authorization } = req.headers;
  
    const token = authorization?.replace("Bearer ", "");
  
    try {
      await db.collection("sessions").deleteOne({ token });
  
      res.status(200).send("Logged Out Successfully!");
    } catch (error) {
      res.status(500).send(error.message);
    }
  };