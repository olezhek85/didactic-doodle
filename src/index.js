import path from "path";
import { fastify } from "fastify";
import { fileURLToPath } from "url";
import fastifyStatic from "fastify-static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify({ logger: true });

const start = async () => {
  try {
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });

    // app.get("/", {}, (request, reply) => {
    //   reply.send({
    //     data: "hello",
    //   });
    // });

    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
