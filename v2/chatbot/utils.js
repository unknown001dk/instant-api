import { MongoClient } from "mongodb";

export const getCollections = async function (uri) {
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = new URL(uri).pathname.substring(1);
  const db = client.db(dbName);
  const collections = await db.listCollections().toArray();
  await client.close();
  return collections.map(col => col.name);
};

export const getSampleSchema = async function (uri, collectionName) {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(new URL(uri).pathname.substring(1));
  const sample = await db.collection(collectionName).findOne();
  await client.close();

  const schema = {};
  for (let key in sample) {
    if (key === "_id") continue;
    const val = sample[key];
    schema[key] = typeof val === "number" ? "Number"
      : typeof val === "boolean" ? "Boolean"
      : "String";
  }
  return schema;
};
