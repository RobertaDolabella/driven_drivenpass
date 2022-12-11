import { ApplicationError } from "@/protocols";

export function duplicatedEmailError(): ApplicationError {
  return {
    name: "DuplicatedEmailError",
    message: "There is already an user with given email",
  };
}

export function invalidCredentialsError(): ApplicationError {
  return {
    name: "InvalidCredentialsError",
    message: "email or password are incorrect",
  };
}

export function conflictError(): ApplicationError {
  return {
    name: "ConflictError",
    message: "There is already a credential with given title",
  };
}

export function invalidIdError(): ApplicationError {
  return {
    name: "InvalidIdError",
    message: "Invalid ID credential",
  };
}


