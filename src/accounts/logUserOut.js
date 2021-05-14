import jwt from "jsonwebtoken";

const JWTSecret = process.env.JWT_SECRET;

export async function logUserOut(request, reply) {
  try {
    const { session } = await import("../session/session.js");

    if (request?.cookies?.refreshToken) {
      const { refreshToken } = request.cookies;
      const { sessionToken } = jwt.verify(refreshToken, JWTSecret);
      await session.deleteOne({
        sessionToken,
      });
    }
    reply.clearCookie("refreshToken").clearCookie("accessToken");
  } catch (e) {
    console.error(e);
  }
}
