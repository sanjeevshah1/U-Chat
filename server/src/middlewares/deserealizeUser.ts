import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../services/session.service";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = get(req, "headers.authorization", "").split(" ")[1];
    const refreshToken = get(req, "cookies.refreshToken");
    if (!accessToken) {
      return next();
    }
    const { expired, decoded } = verifyJwt(accessToken);
    if (decoded) {
      res.locals.user = decoded;
      return next();
    }
    if (expired && refreshToken) {
      const newAccessToken = await reIssueAccessToken(refreshToken as string);
      if (newAccessToken) {
        res.setHeader("x-access-token", newAccessToken);
        const result = verifyJwt(newAccessToken);
        if (result.decoded) {
          res.locals.user = result.decoded;
        }
        return next();
      }
    }

    return next();
  } catch (error: unknown) {
    res
      .status(500)
      .json(error instanceof Error ? error.message : "Something went wrong");
  }
};
