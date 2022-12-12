import Cryptr from "cryptr";
import { faker } from "@faker-js/faker";
import { Credential } from "@prisma/client";
import { prisma } from "@/config";

export async function createCredential(params: Partial<Credential> = {}): Promise<Credential> {

    const incomingPassword = params.password 
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const hashedPassword = cryptr.encrypt(incomingPassword)
    return prisma.credential.create({
        data: {
            title: params.title ,
            url: params.url ,
            username: params.username ,
            password: hashedPassword,
            userId: params.userId 
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
findCredentials

export async function findCredentials(userId: number) {
    return await prisma.credential.findMany({where:{userId}})
}