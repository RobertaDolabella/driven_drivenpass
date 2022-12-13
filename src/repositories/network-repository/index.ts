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

    return await prisma.network.create({
        data: {
            title,
            userId,
            network,
            password
        }
    });



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

async function deleteNetwork(id:number) {
 
    await prisma.network.delete({
        where:{
            id
        }
    })
    return

}
const networkRepository = {
    findNetworkByUserAndTitle,
    createNetworkValid,
    findNetworkByUser,
    findNetworkById,
    deleteNetwork

};
export default networkRepository;