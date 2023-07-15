import request from 'supertest';
import { app } from '../../app';

it('returns 201 on succesful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'abc@abc.com', password: 'password' })
    .expect(201);
})

it('returns a 400 with invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'abcbc.com', password: 'password' })
    .expect(400);
})

it('returns a 400 with invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'abc@cbc.com', password: 'p' })
    .expect(400);
})

it('returns a 400 with missing email and password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400);
})

it('it doesnt allow duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({ email: "test@test.com", password: "password" })
    .expect(400);
})

it("it sets a cookie after succesful signup", async () => {

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: "test@test.com", password: "password" })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined()

})


