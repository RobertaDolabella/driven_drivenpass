import bcrypt from "bcrypt";
import {faker} from "@faker-js/faker";
import { User } from "@prisma/client";
import { prisma } from "@/config";

export  async function createUser(params: Partial<User>  ={}): Promise<User>{

    const incomingPassword = params.password || faker.random.alphaNumeric(10);
    const hashedPassword = await bcrypt.hash(incomingPassword, 12);
    return prisma.user.create({
      data: {
        email: params.email || faker.internet.email(),
        password: hashedPassword,
      }
    });
  }

  export  async function findUsers(email:string){
      return await prisma.user.findMany()
  }