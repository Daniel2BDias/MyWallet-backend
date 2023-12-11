import db from '../database/database.js';

export const checkForEmail = async (email) => {
  return await db.collection('users').findOne({ email });
};

export const checkForUser = async (email) => {
  return await db.collection('users').findOne({ email });
};

export const SignUpRepository = async (req, stripName, hashedPw) => {
  return await db.collection('users').insertOne({ ...req.body, name: stripName.result, password: hashedPw });
};

export const registerUser = async (token, email) => {
  return await db.collection('sessions').insertOne({ token, email });
};

export const logOut = async (token) => {
  return await db.collection('sessions').deleteOne({ token });
};

export const checkForToken = async (token) => {
  return await db.collection('sessions').findOne({ token });
};
