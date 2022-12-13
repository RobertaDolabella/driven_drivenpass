import app, { init } from "@/app";
import { prisma } from "@/config";
import { faker } from "@faker-js/faker";
import { Credential } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { cleanDb } from "../helpers";
import { createUser, createNetwork, findNetwork } from "../factories"


beforeAll(async () => {
    await init();
   
});

beforeEach(async () => {
    await cleanDb();
});


const server = supertest(app);

describe("POST /network", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.post("/network");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.post("/network").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 400 if token is valid but body sent is not valid", async () => {

        const user = await createUser();
        const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const response = await server.post("/network").set("Authorization", `Bearer ${token}`).send(invalidBody);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
});
describe("POST /network, when body and token are valid", () => {
    const generateValidBody = () => ({
        title: faker.name.lastName(),
        network: faker.animal.dog(),
        password: faker.random.alphaNumeric(10)
    });
    it("should respond with status 409 if user already has a similar title ", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const networkBody = generateValidBody();
        const networkRepeated = { ...networkBody, userId: user.id }
        const network = await createNetwork(networkRepeated)

        const response = await server.post("/network").set("Authorization", `Bearer ${token}`).send(networkBody);

        expect(response.status).toBe(httpStatus.CONFLICT);
    });
    it("should respond with status 201 when body is valid and send a token", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
console.log(user.id)
        const networkBody = generateValidBody();

        const response = await server.post("/network").set("Authorization", `Bearer ${token}`).send(networkBody);

        const isNetworkCreated = await findNetwork(user.id)

        console.log(isNetworkCreated)
        expect(response.status).toBe(httpStatus.CREATED);
        expect(isNetworkCreated[0].network).toBe(networkBody.network)
    });
})

describe("GET /network", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/network");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.get("/network").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 200 when a valid token is sent", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const networkPreDefined = await createNetwork({
            title: faker.name.lastName(),
            network: faker.animal.dog(),
            password: faker.random.alphaNumeric(10),
            userId: user.id
        })

        const response = await server.get("/network").set("Authorization", `Bearer ${token}`);

        const isCredentialCreated = await findNetwork(user.id)

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toBeDefined()
    });
})
describe("GET /network/:id", () => {
    it("should respond with status 401 if no token is given", async () => {
        const user = await createUser();
        const response = await server.get(`/network/${user.id}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
        const user = await createUser();
        const response = await server.get(`/network/${user.id}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 401 if token is valid but the id doesn't exist", async () => {

        const user = await createUser();

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const networkPreDefined = await createNetwork({
            title: faker.name.lastName(),
            network: faker.animal.dog(),
            password: faker.random.alphaNumeric(10),
            userId: user.id
        })

        const response = await server.get(`/network/2`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 401 if token is valid but it doesn't match with the id", async () => {

        const user = await createUser();
        const anotherUser = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const networklInfo = {
            title: faker.name.lastName(),
            network: faker.name.firstName(),
            password: faker.random.alphaNumeric(10),
            userId: anotherUser.id
        }

        const credentialPreDefined = await createNetwork(networklInfo)
        // const findeCredentialId = await findCredentials(anotherUser.id)


        const response = await server.get(`/network/${credentialPreDefined.id}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 200 when a valid token is sent and id is correct", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const networklInfo = {
            title: faker.name.lastName(),
            network: faker.animal.dog(),
            password: faker.random.alphaNumeric(10),
            userId: user.id
        }
        const networkPreDefined = await createNetwork(networklInfo)

        const response = await server.get(`/network/${networkPreDefined.id}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toBeDefined()
    });
})
describe("DELETE /network/:id", () => {
    it("should respond with status 401 if no token is given", async () => {
        const user = await createUser();
        const response = await server.delete(`/network/${user.id}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();
        const user = await createUser();
        const response = await server.delete(`/network/${user.id}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 401 if token is valid but the id doesn't exist", async () => {

        const user = await createUser();

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const networkPreDefined = await createNetwork({
            title: faker.name.lastName(),
            network: faker.animal.dog(),
            password: faker.random.alphaNumeric(10),
            userId: user.id
        })

        const response = await server.delete(`/network/2`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 401 if token is valid but it doesn't match with the id", async () => {

        const user = await createUser();
        const anotherUser = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

        const networklInfo = {
            title: faker.name.lastName(),
            network: faker.name.firstName(),
            password: faker.random.alphaNumeric(10),
            userId: anotherUser.id
        }

        const credentialPreDefined = await createNetwork(networklInfo)
        // const findeCredentialId = await findCredentials(anotherUser.id)


        const response = await server.delete(`/network/${credentialPreDefined.id}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 200 when a valid token is sent and id is correct", async () => {
        const user = await createUser();
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const networklInfo = {
            title: faker.name.lastName(),
            network: faker.animal.dog(),
            password: faker.random.alphaNumeric(10),
            userId: user.id
        }
        const credentialPreDefined = await createNetwork(networklInfo)
        const networkFoundBefore = await findNetwork(user.id)
console.log(networkFoundBefore)

        const response = await server.delete(`/network/${credentialPreDefined.id}`).set("Authorization", `Bearer ${token}`);

        const networkFoundAfter = await findNetwork(user.id)
        console.log(networkFoundAfter)
console.log("response", response.body)
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({message:"Network deleted"})
    });
})