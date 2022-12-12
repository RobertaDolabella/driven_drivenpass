import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function findByEmail(email: string) {

  const user =  await prisma.user.findUnique({where:{email}});

  return user
}

async function create(data: Prisma.UserUncheckedCreateInput) {

  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password
    }
  });
}

const userRepository = {
  findByEmail,
  create,
};

export default userRepository;