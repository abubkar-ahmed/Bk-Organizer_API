import allowedOrigns from '../config/allowedOrigns';
import { Request, Response, NextFunction } from 'express';

const credentials = (req: Request, res: Response, next: NextFunction): void => {
  const origin: string | undefined = req.headers.origin;

  if (typeof origin === "string" && origin !== undefined) {
    if (allowedOrigns.includes(origin)) {
      res.header('Access-Control-Allow-Credentials', 'true');
    }
  }
  next();
};

export default credentials;

