import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function findNetworkByUserAndTitle(userId: number, title: string) {

    const network = await prisma.network.findMany({
        where: {
            title,
            userId
        }
    });
    return network

}

async function createNetworkValid(userId: number, title: string, network:string, password: string) {

    await prisma.network.create({
        data: {
            title,
            userId,
            network,
            password
        }
    });

    return

}

async function findNetworkByUser(userId: number) {

    const userNetworks =  await prisma.network.findMany({
        where:{
            userId
        }
    });
  
    return userNetworks
  
  }

  async function findNetworkById(id: number) {

    const userNetworks =  await prisma.network.findUnique({
        where:{
            id
        }
    });
  
    return userNetworks
  
  }

const networkRepository = {
    findNetworkByUserAndTitle,
    createNetworkValid,
    findNetworkByUser,
    findNetworkById

};
export default networkRepository;