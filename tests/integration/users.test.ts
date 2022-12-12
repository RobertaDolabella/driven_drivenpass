import app, { init } from "@/app";
import { prisma } from "@/config";
import { duplicatedEmailError } from "@/services/users-service";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser, findUsers } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("POST /", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });
  describe("when body is valid", () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });
    it("should respond with status 400 when body is valid but the email is not valid", async () => {

      const userInfo = generateValidBody();
      const user = await createUser(userInfo)

      const body = {
        email: faker.internet.email(),
        password: faker.random.alphaNumeric(10)
      }
      const response = await server.post("/").send(body);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
it("should respond with status 200 when body is valid and send a token", async () => {

  const userBody = generateValidBody();

  const user = await createUser(userBody)

  const response = await server.post("/").send(userBody);

  expect(response.status).toBe(httpStatus.OK);
  expect(response.body.token).toBeDefined()
});
  it("should respond with status 400 when body is valid but the password is not correct", async () => {

    const userBody = generateValidBody();
    const body = {
      email: userBody.email,
      password: faker.random.alphaNumeric(10)
    }
    const user = await createUser(userBody)

    const response = await server.post("/").send(body);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  })
})

describe("POST /signup", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/signup");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/signup").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });
  describe("when body is valid", () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });
    it("should respond with status 409 when body is valid but the email is not valid", async () => {

      const userInfo = generateValidBody();
      const user = await createUser(userInfo)

      const response = await server.post("/signup").send(userInfo);

      expect(response.status).toBe(httpStatus.CONFLICT);
    });
   
    it("should respond with status 201 when body is valid and send a token", async () => {

      const userBody = generateValidBody();
    
      const response = await server.post("/signup").send(userBody);

      const isUserCreated = await findUsers(userBody.email)
    
      expect(response.status).toBe(httpStatus.CREATED);
      expect(isUserCreated[0].email).toBe(userBody.email)
    });
  })
})