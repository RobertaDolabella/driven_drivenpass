import cryptr from "cryptr";
import { faker } from "@faker-js/faker";
import { Credential, User } from "@prisma/client";
import { prisma } from "@/config";

export async function createCredential(params: Partial<Credential> = {}): Promise<Credential> {

    const incomingPassword = params.password || faker.random.alphaNumeric(10);
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const hashedPassword = await cryptr.encrypt(incomingPassword)
   
   return  prisma.credential.create({
        data: {
            title: params.title || faker.name.firstName() ,
            url: params.url || faker.internet.url(),
            username: params.username || faker.name.lastName(),
            password: hashedPassword,
            userId: params.userId || faker.datatype.number()
        }

    })

}
    // const incomingPassword = params.password || faker.random.alphaNumeric(10);
    // const hashedPassword = await bcrypt.hash(incomingPassword, 12);
    // return prisma.user.create({
    //   data: {
    //     email: params.email || faker.internet.email(),
    //     password: hashedPassword,
    //   }
    // });

findCredentials

export async function findCredentials(userId: number) {
    return prisma.credential.findMany({where:{userId}})
}