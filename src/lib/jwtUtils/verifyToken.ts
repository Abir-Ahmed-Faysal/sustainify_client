import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true,
      data: decoded,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
    };
  }
};