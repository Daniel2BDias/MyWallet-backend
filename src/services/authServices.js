import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { SignUpRepository, registerUser } from '../repositories/authRepository.js';

export const signUpService = async (req, password, stripHtml) => {
  const hashedPw = bcrypt.hashSync(password, 10);
  return await SignUpRepository(req, stripHtml, hashedPw);
};

export const checkPassword = async (password, existingUser) => {
  return bcrypt.compareSync(password, existingUser.password);
};

export const tokenGeneration = async (email) => {
  const token = uuid();
  await registerUser(token, email);
  return token;
};
