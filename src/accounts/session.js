import { randomBytes } from "crypto";

export async function createSession(userId, connection) {
  try {
    const sessionToken = randomBytes(43).toString("hex");

    const { ip, userAgent } = connection;

    const { session } = await import("../session/session.js");

    await session.insertOne({
      sessionToken,
      userId,
      valid: true,
      userAgent,
      ip,
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    return sessionToken;
  } catch (e) {
    throw new Error("Session Creation Failed");
  }
}
