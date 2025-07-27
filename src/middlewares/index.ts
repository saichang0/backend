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

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;
    const userId = String(decoded?.id);

    //  Don't overwrite req.body, just add to it
    req.body.userId = userId;
    next();
  } catch (error) {
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
