import app, { init } from "@/app";
import { prisma } from "@/config";
import {faker} from "@faker-js/faker";
import { Credential } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { cleanDb } from "../helpers";
import {createUser, createCredential, findCredentials} from "../factories"
import { title } from "process";
import { string } from "joi";


beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});
afterEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("POST /credential", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/credential");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/credential").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 400 if token is valid but body sent is not valid", async () => {

    const user = await createUser();
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    const response = await server.post("/credential").set("Authorization", `Bearer ${token}`).send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });
  describe("when body and token are valid",() => {
    const generateValidBody = () => ({
        title: faker.name.lastName(),
        url: faker.internet.url(),
        username: faker.name.firstName(),
        password: faker.random.alphaNumeric(10)
    });
    it("should respond with status 409 if user already has a similar title ", async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const credentialBody = generateValidBody();
        const credentialRepeated = {...credentialBody, userId: user.id}
        const credential = await createCredential(credentialRepeated)

        const response = await server.post("/credential").set("Authorization", `Bearer ${token}`).send(credentialBody);
    
        expect(response.status).toBe(httpStatus.CONFLICT);
      });
it("should respond with status 201 when body is valid and send a token", async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    const credentialBody = generateValidBody();
  
    const response = await server.post("/credential").set("Authorization", `Bearer ${token}`).send(credentialBody);

    const isCredentialCreated = await findCredentials(user.id)
    expect(response.status).toBe(httpStatus.CREATED);
    expect(isCredentialCreated[0].username).toBe(credentialBody.username)
  });
})
})

describe("GET /credential", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/credential");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/credential").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it("should respond with status 200 when a valid token is sent", async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    const credentialPreDefined = await createCredential({
      title: faker.name.lastName(),
      url: faker.internet.url(),
      username: faker.name.firstName(),
      password: faker.random.alphaNumeric(10),
      userId: user.id
  })
  
    const response = await server.get("/credential").set("Authorization", `Bearer ${token}`);

    const isCredentialCreated = await findCredentials(user.id)

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toBeDefined()
  });
})
describe("GET /credential/:id", () => {
  it("should respond with status 401 if no token is given", async () => {
    const user = await createUser();
    const response = await server.get(`/credential/${user.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const user = await createUser();
    const response = await server.get(`/credential/${user.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it("should respond with status 401 if token is valid but the id doesn't exist", async () => {

    const user = await createUser();
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    const credentialPreDefined = await createCredential({
      title: faker.name.lastName(),
      url: faker.internet.url(),
      username: faker.name.firstName(),
      password: faker.random.alphaNumeric(10),
      userId: user.id
  })

    const response = await server.get(`/credential/2`).set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it("should respond with status 401 if token is valid but it doesn't match with the id", async () => {

    const user = await createUser();
    const anotherUser = await createUser();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    const credentialInfo = {
      title: faker.name.lastName(),
      url: faker.internet.url(),
      username: faker.name.firstName(),
      password: faker.random.alphaNumeric(10),
      userId: anotherUser.id
    }

    const credentialPreDefined = await createCredential(credentialInfo)
    // const findeCredentialId = await findCredentials(anotherUser.id)


    const response = await server.get(`/credential/${credentialPreDefined.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it("should respond with status 200 when a valid token is sent and id is correct", async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    const credentialInfo = {
      title: faker.name.lastName(),
      url: faker.internet.url(),
      username: faker.name.firstName(),
      password: faker.random.alphaNumeric(10),
      userId: user.id
    }
    const credentialPreDefined = await createCredential(credentialInfo)
  
    const response = await server.get(`/credential/${credentialPreDefined.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toBeDefined()
  });
})