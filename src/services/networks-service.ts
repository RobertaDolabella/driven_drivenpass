import { conflictError } from "./errors";
import networkRepository from "@/repositories/network-repository";
import { Network } from "@prisma/client";
import cryptr from "cryptr"
import * as jwt from "jsonwebtoken";
import { invalidIdError } from "./errors";


export async function createNetwork(userId: number, title: string, network: string, password: string) {

    const isTitleNotValid = await networkRepository.findNetworkByUserAndTitle(userId, title)
console.log("verificou o userid")
    if (isTitleNotValid.length>0) {
        throw conflictError()
    }

    const hashedPassword = await criptPassword(password)

    await networkRepository.createNetworkValid(userId, title,network,hashedPassword)
console.log("passou do cretaed")
    return
}
async function criptPassword(password: string) {

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.SECRET_KEY);

    return await cryptr.encrypt(password)

}
export async function findNetwork(userId: number) {

    const usersNetworks = await networkRepository.findNetworkByUser(userId)

   const userCredentialsPasswordDecript =  await decryptHashPasswords(usersNetworks)

    return userCredentialsPasswordDecript
}

export async function findNetworkById(userId: number, id:number) {

    const idNetwork = await networkRepository.findNetworkById(id)

    if(!idNetwork){
        throw invalidIdError()
    }
    if(userId!==idNetwork.userId){
        console.log("o userId não é igual ao id user")
        console.log(userId, idNetwork.id)
        throw invalidIdError()
    }

   const idCredentialPasswordDecript =  decryptHashPassword(idNetwork)

    return idCredentialPasswordDecript

}

async function decryptHashPasswords(usersNetworks: Network[]) {

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.SECRET_KEY);

    for(let i =0; i<usersNetworks.length; i++){
        usersNetworks[i].password = cryptr.decrypt(usersNetworks[i].password)
    }

    return usersNetworks

}
async function decryptHashPassword(usersNetwork: Network) {

    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    usersNetwork.password = cryptr.decrypt(usersNetwork.password)

    return usersNetwork

}

export type CreateNetworkParams = Omit<Network, "id" & "userId">;

const networkService = {
    createNetwork,
    findNetwork,
    findNetworkById
 
};

export * from "./errors";
export default networkService;
