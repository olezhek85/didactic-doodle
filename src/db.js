import mongo from "mongodb";

const { MongoClient } = mongo;

const uri = process.env.MONGO_URI;

export const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function connectDb() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
  } catch (e) {
    console.error(e);
    await client.close();
  }
}
