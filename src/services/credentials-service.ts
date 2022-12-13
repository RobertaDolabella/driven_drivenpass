import { conflictError } from "./errors";
import credentialRepository from "@/repositories/creedential-repository";
import { Credential } from "@prisma/client";
import cryptr from "cryptr"
import * as jwt from "jsonwebtoken";
// import eventsService from "../events-service";
import { invalidIdError } from "./errors";


export async function createCredential(userId: number, title: string, username: string, url: string, password: string) {

    const isTitleNotValid = await credentialRepository.findCredentailByUserAndTitle(userId, title)

    if (isTitleNotValid.length>0) {
   
        throw conflictError()
    }

    const hashedPassword = await criptPassword(password)

    await credentialRepository.createCrendentialValid(userId, title, username, url, hashedPassword)

    return
}

export async function findCredential(userId: number) {

    const usersCredentials = await credentialRepository.findCredentailByUser(userId);

   const userCredentialsPasswordDecript =  await decryptHashPasswords(usersCredentials);

    return userCredentialsPasswordDecript
}
export async function findCredentialById(userId: number, id:number) {

    const idCredentials = await credentialRepository.findCredentailById(id);
    if(!idCredentials){
        throw invalidIdError()
    };

    if(userId!==idCredentials.userId){
        throw invalidIdError()
    };

   const idCredentialPasswordDecript =  decryptHashPassword(idCredentials);
    return idCredentialPasswordDecript
}


async function criptPassword(password: string) {

    const Cryptr = require('cryptr');
    const cryptr = await new Cryptr(process.env.SECRET_KEY);

    return await cryptr.encrypt(password)

}
async function decryptHashPasswords(usersCredentials: Credential[]) {

    const Cryptr = require('cryptr');
    const cryptr = await new Cryptr(process.env.SECRET_KEY);

    for(let i =0; i<usersCredentials.length; i++){
        usersCredentials[i].password = await cryptr.decrypt(usersCredentials[i].password)
    }

    return usersCredentials

}

async function decryptHashPassword(usersCredential: Credential) {

    const Cryptr = require('cryptr');
    const cryptr = await  new Cryptr(process.env.SECRET_KEY);
    usersCredential.password = await cryptr.decrypt(usersCredential.password);

    return usersCredential

}

export async function findCredentialByIdAndDelete(userId: number, id:number) {

    const idNetwork = await credentialRepository.findCredentailById(id);

    if(!idNetwork){
        throw invalidIdError()
    };
    if(userId!==idNetwork.userId){
        throw invalidIdError()
    };

   await credentialRepository.deleteCredential(id);

    return  {message:"Credential deleted"}

}
export type CreateCredentialParams = Omit<Credential, "id" & "userId">;

const credentialService = {
    createCredential,
    findCredential,
    findCredentialById,
    findCredentialByIdAndDelete
};

export * from "./errors";
export default credentialService;
