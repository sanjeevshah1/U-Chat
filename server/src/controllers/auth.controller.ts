import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  SignUpSchemaType,
  LoginSchemaType,
  UpdateUserSchemaType,
} from "../schema/user.schema";
import {
  createUser,
  validatePassword,
  updateUser,
} from "../services/user.service";
import { createSession, reIssueAccessToken } from "../services/session.service";
import { signinJwt } from "../utils/jwt.utils";
import { UserWithoutPassword } from "../types";
import jwt from "jsonwebtoken";
import redis from "../utils/redis.utils";

export const signUpHandler = async (
  req: Request<object, object, SignUpSchemaType["body"]>,
  res: Response,
) => {
  try {
    const { email, fullname, password, profilePicture } = req.body;
    const createdUser = await createUser({
      email,
      fullname,
      password,
      profilePicture,
    });

    const stringifiedId = createdUser._id.toString();
    const session = await createSession(
      stringifiedId,
      req.get("user-agent") || "",
    );

    const accessToken = signinJwt(
      {
        ...createdUser,
        session: session._id,
      },
      {
        expiresIn: "1d",
      },
    );

    const refreshToken = signinJwt(
      {
        ...createdUser,
        session: session._id,
      },
      {
        expiresIn: "7d",
      },
    );
    // Set Refresh Token as cookie (long-lived)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({
      success: true,
      message: "User Signed Up Succesfully, refresh token set in cookies",
      accessToken,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const loginHandler = async (
  req: Request<object, object, LoginSchemaType["body"]>,
  res: Response,
) => {
  try {
    const validatedUser: false | UserWithoutPassword = await validatePassword(
      req.body,
    );
    if (validatedUser === false) {
      res.status(401).json({
        success: false,
        message: "Invalid email or Password",
      });
    } else {
      const id = validatedUser._id as mongoose.Schema.Types.ObjectId;
      const stringifiedId = id.toString();
      const session = await createSession(
        stringifiedId,
        req.get("user-agent") || "",
      );

      const accessToken = signinJwt(
        {
          ...validatedUser,
          session: session._id,
        },
        {
          expiresIn: "1d",
        },
      );

      const refreshToken = signinJwt(
        {
          ...validatedUser,
          session: session._id,
        },
        {
          expiresIn: "7d",
        },
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res
        .status(200)
        .json({ success: true, message: "logged in succesfully", accessToken });
    }
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  console.log(req.cookies);
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) res.status(400).json({ message: "No token provided" });

  try {
    const decoded = jwt.decode(refreshToken) as { exp: number };
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);

    await redis.set(`bl:${refreshToken}`, "1", "EX", ttl); // auto-expire when token expires
    console.log();
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out and token blacklisted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid token", error: error });
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res
      .status(400)
      .json({ success: false, message: "refresh token not found in cookie" });
  }
  try {
    const accessToken: string | false = await reIssueAccessToken(refreshToken);
    if (!accessToken) {
      res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Access Token Reissued", accessToken });
    }
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const updateProfileHandler = async (
  req: Request<object, object, UpdateUserSchemaType["body"]>,
  res: Response,
) => {
  try {
    const user = await updateUser(req.body);
    res.status(200).json({
      success: true,
      message: "Profile Updated Succesfully",
      updatedUser: user,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
