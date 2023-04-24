import request from 'supertest';
import app from '../../app';
import { SIGNUP_ROUTE } from '../signup';

/**
 * Valid email conditions:
 *  -Standard email formats from 'express-validator' package
 */
describe('tests validity of email input', () => {
  let password = '';

  beforeAll(() => {
    password = 'ValidPassword1';
  });

  it('should return 422 if the email is not provided', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ password }).expect(422);
  });

  it('should return 422 if the email is not valid', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ email: 'invalidEmail', password }).expect(422);
  });

  it('should return 200 if the email is valid', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ email: 'test@tes.com', password }).expect(200);
  });
});

/***
 * Valid password conditions:
 * - Atleast 8 characters
 * - Atmost 32 characters
 * - One lowercase letter
 * - One uppercase letter
 * - One digit
 */
describe('tests validity of password input', () => {
  let email = '';

  beforeAll(() => {
    email = 'test@test.com';
  });

  it('should return 422 if the password is not provided', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ email }).expect(422);
  });

  it('should return 422 if the password contains less than 8 characters', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ email, password: 'Valid12' }).expect(422);
  });

  it('should return 422 if the password contains more than 32 characters', async () => {
    await request(app)
      .post(SIGNUP_ROUTE)
      .send({ email, password: 'Valid12Valid12Valid12Valid12Valid12Valid12' })
      .expect(422);
  });

  it('should return 422 if the password does not contain lowercase character', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ email, password: 'VALID12345' }).expect(422);
  });

  it('should return 422 if the password does not contain uppercase character', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ email, password: 'valid1234' }).expect(422);
  });

  it('should return 422 if the password does not contain a digit', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ email, password: 'ValidValid' }).expect(422);
  });

  it('should return 200 if the password is valid', async () => {
    await request(app).post(SIGNUP_ROUTE).send({ email, password: 'ValidValid12' }).expect(200);
  });
});

describe('tests sanitization of email input', () => {
  it('should not contain uppercase letters in the domain of the email', async () => {
    const normalizeEmail = 'test@test.com';

    const response = await request(app)
      .post(SIGNUP_ROUTE)
      .send({
        email: 'test@TEST.com',
        password: 'Valid123'
      })
      .expect(200);

    expect(response.body.email).toEqual(normalizeEmail);
  });
});

describe('tests sanitization of password input', () => {
  it('should not contain unescaped characters', async () => {
    await request(app)
      .post(SIGNUP_ROUTE)
      .send({
        email: 'test@test.com',
        password: 'Valid1<>'
      })
      .expect(200);
  });
});
