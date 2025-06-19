import jwt from "jsonwebtoken";
import { DecodedUser } from "../types";

//sign in private key
export function signinJwt(
  object: object,
  options?: jwt.SignOptions | undefined,
): string {
  const privateKey = process.env.PRIVATE_KEY!;
  console.log("the private key is", privateKey);
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

//verify with public key
export function verifyJwt(token: string): {
  valid: boolean;
  decoded: DecodedUser | null;
  expired: boolean;
} {
  const publicKey = process.env.PUBLIC_KEY!;
  console.log("the public key is", publicKey);
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      decoded: decoded as DecodedUser,
      expired: false,
    };
  } catch (error) {
    const err = error as Error;
    return {
      valid: false,
      decoded: null,
      expired: err.message === "jwt expired",
    };
  }
}
