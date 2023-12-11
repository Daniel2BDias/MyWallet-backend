import { Router } from 'express';
import { logOutController, loginController, signUpController } from '../controllers/authControllers.js';
import { signUpSchema, loginSchema } from '../schemas/authSchemas.js';
import validateSchema from '../middlewares/validateSchema.js';

const authRouter = Router();

authRouter.post('/cadastro', validateSchema(signUpSchema), signUpController);

authRouter.post('/login', validateSchema(loginSchema), loginController);

authRouter.post('/logout/', logOutController);

export default authRouter;
