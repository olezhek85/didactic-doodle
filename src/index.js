import "./env.js";
import path from "path";
import { fastify } from "fastify";
import { fileURLToPath } from "url";
import fastifyStatic from "fastify-static";
import fastifyCookie from "fastify-cookie";
import { connectDb } from "./db.js";
import { registerUser } from "./accounts/register.js";
import { authorizeUser } from "./accounts/authorize.js";
import { logUserIn } from "./accounts/logUserIn.js";
import { getUserFromCookies } from "./accounts/user.js";
import { logUserOut } from "./accounts/logUserOut.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify({ logger: true });

const start = async () => {
  try {
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET,
    });

    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });

    app.post("/api/register", {}, async (request, reply) => {
      try {
        const userId = await registerUser(
          request.body.email,
          request.body.password
        );
      } catch (e) {
        console.error(e);
      }
    });

    app.post("/api/authorize", {}, async (request, reply) => {
      try {
        const { isAuthorized, userId } = await authorizeUser(
          request.body.email,
          request.body.password
        );

        if (isAuthorized) {
          await logUserIn(userId, request, reply);
          reply.send({
            data: "User Logged In",
          });
        } else {
          reply.send({
            data: "Auth Failed",
          });
        }
      } catch (e) {
        console.error(e);
      }
    });

    app.get("/test", {}, async (request, reply) => {
      try {
        const user = await getUserFromCookies(request, reply);

        if (user?._id) {
          reply.send({
            data: user,
          });
        } else {
          reply.send({
            data: "User Lookup Failed",
          });
        }
      } catch (e) {
        console.error(e);
      }
    });

    app.post("/api/logout", {}, async (request, reply) => {
      try {
        await logUserOut(request, reply);
        reply.send({
          data: "User Logged Out",
        });
      } catch (e) {
        console.error(e);
      }
    });

    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

connectDb().then(() => {
  start();
});
