import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db;

async function dbConnection() {
  const mongoClient = new MongoClient(process.env.DATABASE_URL);
  await mongoClient.connect();
  db = mongoClient.db();
}

dbConnection();

export default db;
