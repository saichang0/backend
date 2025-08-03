import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { handleErrorOneRespones } from "../utils";
import { User } from "../modules/users/user.entity";

export const accessAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json(
        handleErrorOneRespones({
          code: "UNAUTHENTICATE",
          message: "Token is missing",
          error: {},
          status: 401,
        })
      );
    }

    // Optional Bearer prefix handling
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const decoded = jwt.verify(token, "abc") as User;
    const userId = String(decoded?.id);
    //  Don't overwrite req.body, just add to it
    if(!req.body) req.body = {};
    req.body.userId = userId;
    next();
  } catch (error) {
      console.error("❌ JWT verification error:", error);
    return res.status(401).json(
      handleErrorOneRespones({
        code: "INVALID_TOKEN",
        message: "Token is invalid or expired",
        error: {},
        status: 401,
      })
    );
  }
};
