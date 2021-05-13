import mongo from "mongodb";
import jwt from "jsonwebtoken";

const { ObjectId } = mongo;

const JWTSecret = process.env.JWT_SECRET;

export async function getUserFromCookies(request) {
  try {
    const { user } = await import("../user/user.js");

    if (request?.cookies?.accessToken) {
      const { accessToken } = request.cookies;
      const decodedAccessToken = jwt.verify(accessToken, JWTSecret);
      return user.findOne({ _id: ObjectId(decodedAccessToken?.userId) });
    }
  } catch (e) {
    console.error(e);
  }
}

export async function refreshTokens() {
  try {
  } catch (e) {
    console.error(e);
  }
}
