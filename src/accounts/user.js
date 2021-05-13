import mongo from "mongodb";
import jwt from "jsonwebtoken";
import { createTokens } from "./token.js";

const { ObjectId } = mongo;

const JWTSecret = process.env.JWT_SECRET;

export async function getUserFromCookies(request, reply) {
  try {
    const { user } = await import("../user/user.js");
    const { session } = await import("../session/session.js");

    if (request?.cookies?.accessToken) {
      const { accessToken } = request.cookies;
      const decodedAccessToken = jwt.verify(accessToken, JWTSecret);
      return user.findOne({ _id: ObjectId(decodedAccessToken?.userId) });
    }

    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies;
      const { sessionToken } = jwt.verify(refreshToken, JWTSecret);
      const currentSession = await session.findOne({
        sessionToken,
      });

      if (currentSession.valid) {
        const currentUser = await user.findOne({
          _id: ObjectId(currentSession.userId),
        });

        await refreshTokens(sessionToken, currentUser._id, reply);

        return currentUser;
      }
    }
  } catch (e) {
    console.error(e);
  }
}

export async function refreshTokens(sessionToken, userId, reply) {
  try {
    const { accessToken, refreshToken } = await createTokens(
      sessionToken,
      userId
    );

    const now = new Date();
    const refreshExpires = now.setDate(now.getDate() + 30);

    reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
        expires: refreshExpires,
      })
      .setCookie("accessToken", accessToken, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
      });
  } catch (e) {
    console.error(e);
  }
}
