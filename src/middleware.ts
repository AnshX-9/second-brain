import { NextFunction,  Request,  Response } from "express"
import jwt from 'jsonwebtoken'
import { JWT_TOKEN_PASSWORD } from "./config";
export const userMiddleware = (req: Request,  res: Response, next:NextFunction) =>
   {
  const header = req.headers["authorization"];
  const decode = jwt.verify(header  as string, JWT_TOKEN_PASSWORD);
  if(decode) {
    // @ts-ignore 
    req.userId = decode.id
    next()
  } else {
    res.status(403).json({
      message: "your not logged in"
    })
  }
}
