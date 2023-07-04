import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";


const app = express();

app.use(cors());
app.use(json());
dotenv.config();

try{
    const mongoClient = new MongoClient(process.env.DATABASE_URL);
    await mongoClient.connect();
    const db = mongoClient.db("MyWallet");
} catch (error) {
    console.log(error.message);
}

app.listen(process.env.PORT, () => console.log(`Servidor Online! PORT: ${process.env.PORT}`));