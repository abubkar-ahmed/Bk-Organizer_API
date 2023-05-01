const jwt = require('jsonwebtoken');
const User = require('../model/User');
import { Request , Response } from "express";


const getCurrentUser = async (req: Request, res: Response): Promise<{status: boolean, message?: string, userId?: string}> => {
  let currentUser: string | undefined;
  const authHeader = req.headers.authorization || req.headers.Authorization as string;
  const token = authHeader?.split(' ')[1];
  jwt.verify(
    token as string,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return {
          status: false,
          message: "Something Went Wrong Please Try Again Later.",
        };
      }
      currentUser = decoded.email;
    }
  );

  try {
    const user = await User.findOne({ email: currentUser }).exec();
    if (!user) {
      return {
        status: false,
        message: "No User Found",
      };
    }
    return {
      status: true,
      userId: user._id,
    };
  } catch (err) {
    console.log(err);
    return {
      status: false,
      message: "Something Went Wrong Please Try Again Later.",
    };
  }
};

export default getCurrentUser ;
