import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const SIGNUP_ROUTE = '/api/auth/signup';

const signUpRouter = express.Router();

signUpRouter.post(
  SIGNUP_ROUTE,
  [
    body('email').isEmail().withMessage('Email must be in valid format...').normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 8, max: 32 })
      .withMessage('Password must be between 8 and 32 characters...'),
    body('password')
      .matches(/^(.*[a-z].*)$/)
      .withMessage('Password must contain atleast one lowercase letter'),
    body('password')
      .matches(/^(.*[A-Z].*)$/)
      .withMessage('Password must contain atleast one uppercase letter'),
    body('password')
      .matches(/^(.*\d.*)$/)
      .withMessage('Password must contain atleast one digit'),
    body('password').escape()
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.sendStatus(422);
    }

    if (/.+@[A-Z]/g.test(req.body.email)) {
      return res.sendStatus(422);
    }

    if (/[><'*/]/g.test(req.body.password)) {
      return res.sendStatus(422);
    }

    res.send({ email: req.body.email });
  }
);

export default signUpRouter;
