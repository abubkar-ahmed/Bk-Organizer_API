import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');


const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader : any = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err) return res.sendStatus(403);
      req.body.user = decoded.username;
      next();
    }
  );
};

export default verifyJWT;
