import { oauthClient } from "./user.controller.js";

export const AuthMiddleware = async (req, res, next) => {
  try {
    console.log( req.cookies);
    const { accessToken } = req.cookies;

    if (!accessToken) {
      console.log(`NO accessToken found`);
      return next(new Error(`NO accessToken found`)); 
    }

    req.accessToken = accessToken;
    next();
  } catch (error) {
    console.log(`Error in the auth middleware ${error}`);
    next(error);
  }
};
