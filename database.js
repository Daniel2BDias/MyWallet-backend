import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
let db;

try {
  const mongoClient = new MongoClient(process.env.DATABASE_URL);
  await mongoClient.connect();
  db = mongoClient.db("mywallet");
} catch (error) {
  console.log(error.message);
}

export default db;