import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
import Session from "../models/session.model";
import { SessionDocument } from "../models/session.model";
import { signinJwt, verifyJwt } from "../utils/jwt.utils";
import { findUser } from "./user.service";
import redis from "../utils/redis.utils";

export async function createSession(user: string, userAgent: string) {
  console.log("creatSession service executing");
  try {
    const session = await Session.create({
      user,
      userAgent,
    });
    return session;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : `Something went wrong while creating session : ${error}`,
    );
  }
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>,
) {
  try {
    const updated = await Session.updateOne(query, update);
    return updated;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : `Something went wrong while updating sessions : ${error}`,
    );
  }
}
export async function findSessions(query: FilterQuery<SessionDocument>) {
  try {
    const sessions = await Session.find(query).lean();
    return sessions;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : `Something went wrong while getting sessions : ${error}`,
    );
  }
}

export async function reIssueAccessToken(
  token: string,
): Promise<false | string> {
  try {
    const isBlacklisted = await redis.get(`bl:${token}`);
    if (isBlacklisted) return false;

    const { decoded } = verifyJwt(token);
    if (!decoded || !decoded.session) return false;

    const session: SessionDocument | null = await Session.findOne({
      _id: decoded.session,
    });
    if (!session || !session.valid) return false;

    const userId = session.user as mongoose.Schema.Types.ObjectId;
    const user = await findUser({ _id: userId.toString() });
    if (!user) return false;

    const accessToken = signinJwt(
      { ...user, session: session._id },
      { expiresIn: "1d" },
    );
    return accessToken;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : `Something went wrong while reIssuing access token : ${error}`,
    );
  }
}
