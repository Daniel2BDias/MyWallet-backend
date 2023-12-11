import { stripHtml } from 'string-strip-html';
import { checkForEmail, checkForUser, logOut } from '../repositories/authRepository';
import { checkPassword, signUpService, tokenGeneration } from '../services/authServices';

export const signUpController = async (req, res) => {
  const { email, password, name } = req.body;
  const stripName = stripHtml(name);

  try {
    const alreadySignedEmail = await checkForEmail(email);
    if (alreadySignedEmail) return res.sendStatus(409);
    await signUpService(req, password, stripName);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await checkForUser(email);
    if (!existingUser) return res.sendStatus(404);
    const pWordValid = checkPassword(password, existingUser);
    if (!pWordValid) return res.sendStatus(401);
    const token = await tokenGeneration(email);
    res.status(200).send({ token, email, name: existingUser.name });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const logOutController = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  try {
    await logOut(token);
    res.status(200).send('Logged Out Successfully!');
  } catch (error) {
    res.status(500).send(error.message);
  }
};
