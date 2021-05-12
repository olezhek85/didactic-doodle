import { createSession } from "./session.js";

export async function logUserIn(userId, request, reply) {
  const connectionInfo = {
    ip: request.ip,
    userAgent: request.headers["user-agent"],
  };

  const sessionToken = await createSession(userId, connectionInfo);
}
