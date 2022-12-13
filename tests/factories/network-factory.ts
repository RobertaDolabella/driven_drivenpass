import Cryptr from "cryptr";
import { faker } from "@faker-js/faker";
import { Network } from "@prisma/client";
import { prisma } from "@/config";

export async function createNetwork(params: Partial<Network> = {}): Promise<Network> {

    const incomingPassword = params.password || faker.random.alphaNumeric(10);
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const hashedPassword = await cryptr.encrypt(incomingPassword)
    return prisma.network.create({
        data: {
            title: params.title || faker.name.firstName() ,
            network: params.network || faker.internet.url(),
            password: hashedPassword,
            userId: params.userId || faker.datatype.number()
        }

    })


    // const incomingPassword = params.password || faker.random.alphaNumeric(10);
    // const hashedPassword = await bcrypt.hash(incomingPassword, 12);
    // return prisma.user.create({
    //   data: {
    //     email: params.email || faker.internet.email(),
    //     password: hashedPassword,
    //   }
    // });
}

export async function findNetwork(userId: number) {
    return prisma.network.findMany()
}


