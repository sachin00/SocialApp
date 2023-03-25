import express from 'express';
import { body, validationResult } from 'express-validator';
import { Request, Response } from 'express';

const signUpRouter = express.Router();

signUpRouter.post(
  '/api/auth/signup',
  [body('email').isEmail().withMessage('Email must be in valid format...')],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).send({});
    }

    res.send({});
  }
);

export default signUpRouter;
