import { conflictError } from "./errors";
import credentialRepository from "@/repositories/creedential-repositpry";
import { Credential } from "@prisma/client";
import cryptr from "cryptr"
import * as jwt from "jsonwebtoken";
// import eventsService from "../events-service";
import { duplicatedEmailError, invalidCredentialsError, invalidIdError } from "./errors";


export async function createCredential(userId: number, title: string, username: string, url: string, password: string) {

    const isTitleNotValid = await credentialRepository.findCredentailByUserAndTitle(userId, title)

    if (isTitleNotValid) {
        throw conflictError()
    }

    const hashedPassword = await criptPassword(password)

    await credentialRepository.createCrendentialValid(userId, title, username, url, hashedPassword)

    return
}

export async function findCredential(userId: number) {

    const usersCredentials = await credentialRepository.findCredentailByUser(userId)

   const userCredentialsPasswordDecript =  decryptHashPasswords(usersCredentials)

    return userCredentialsPasswordDecript
}
export async function findCredentialById(userId: number, id:number) {

    const idCredentials = await credentialRepository.findCredentailById(id)

    if(!idCredentials){
        throw invalidIdError()
    }

    if(userId!==idCredentials[0].id){
        throw invalidIdError()
    }

   const idCredentialPasswordDecript =  decryptHashPasswords(idCredentials)

    return idCredentialPasswordDecript
}


async function criptPassword(password: string) {

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.SECRET_KEY);

    return await cryptr.encrypt(password)

}
async function decryptHashPasswords(usersCredentials: Credential[]) {

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.SECRET_KEY);

    for(let i =0; i<usersCredentials.length; i++){
        usersCredentials[i].password = cryptr.decrypt(usersCredentials[i].password)
    }

    return usersCredentials

}

export type CreateCredentialParams = Omit<Credential, "id" & "userId">;

const credentialService = {
    createCredential,
    findCredential,
    findCredentialById
};

export * from "./errors";
export default credentialService;
