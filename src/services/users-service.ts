import { cannotEnrollBeforeStartDateError } from "@/errors";
import userRepository from "@/repositories/user-repository";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
// import eventsService from "../events-service";
import { duplicatedEmailError, invalidCredentialsError } from "./errors";

export async function createUser({ email, password }: CreateUserParams): Promise<User> {

  await validateUniqueEmailOrFail(email);

  const hashedPassword = await bcrypt.hash(password, 12);

  return userRepository.create({
    email,
    password: hashedPassword,
  });
}

async function validateUniqueEmailOrFail(email: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw duplicatedEmailError();
  }
}

export async function logUserIn(email:string, password:string ){

  const user =  await findUserByEmail(email)

  validatePasswordOrFail(password, user.password)

  const token = generateToken(user.id)

  return token
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

async function findUserByEmail(email: string) {
  const userByEmail = await userRepository.findByEmail(email);
  if (!userByEmail) {
    throw invalidCredentialsError();
  }
  return userByEmail
}


function generateToken(userId:number) {

  const token = jwt.sign({userId}, process.env.JWT_SECRET);

  return token
}


export type CreateUserParams = Pick<User, "email" | "password">;

const userService = {
  createUser,
  logUserIn
};

export * from "./errors";
export default userService;
