import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function findCredentailByUserAndTitle(userId: number, title: string) {

  const credential =  await prisma.credential.findMany({
      where:{
          title,
          userId
      }
  });

  return credential

}

async function createCrendentialValid(userId:number, title: string, username: string, url: string, password: string):Promise<Credential> {

   
 await prisma.credential.create({
        data:{
            title,
            userId, 
            username,
            url,
            password
        }
    });
return
  
  }

  async function findCredentailByUser(userId: number) {

    const userCredentials =  await prisma.credential.findMany({
        where:{
            userId
        }
    });
  
    return userCredentials
  
  }
  async function findCredentailById(id: number) {

    const userCredentials =  await prisma.credential.findUnique({
        where:{
            id
        }
    });
  
    return userCredentials
  
  }

const credentialRepository = {
    findCredentailByUserAndTitle,
    createCrendentialValid,
    findCredentailByUser,
    findCredentailById

};

export default credentialRepository;