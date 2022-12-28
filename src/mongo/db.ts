import "https://deno.land/x/dotenv/load.ts";
import { MongoClient, Database, Collection } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import {MessageSchema,UserSchema } from "./schemas.ts";

//import { CocheSchema, ConcesionarioSchema, VendedorSchema } from "./schemas.ts";

const connectMongoDB = async (): Promise<Database> => {
  const mongo_url = Deno.env.get("URL_MONGO")
  const client = new MongoClient();
  if(mongo_url){
  console.log("conectando...");
  await client.connect(mongo_url);
  console.log("conectado");
  }
  const db = client.database("practica5");
  return db;
};

const db = await connectMongoDB();
console.info(`MongoDB practica5 connected`);

export const UserCollection:Collection <UserSchema> = db.collection<UserSchema>("Users")
export const MessageCollection:Collection <MessageSchema> = db.collection<MessageSchema>("Messages")