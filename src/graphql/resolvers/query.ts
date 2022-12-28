import { createJWT } from "../../jwt/jwt.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

import { MessageCollection, UserCollection } from "../../mongo/db.ts";
import { MessageSchema, UserSchema } from "../../mongo/schemas.ts";
import { Message } from "../../types.ts";

export const Query = {
  login: async (parent: unknown,args: {username: string;password: string;}): Promise<string> => {
    try {
      const user: UserSchema | undefined = await UserCollection.findOne({username: args.username,});
      if (!user) throw new Error("User does not exist");
      const validPassword = await bcrypt.compare(args.password, user.password);
      if (!validPassword) throw new Error("Invalid password");
      const token = await createJWT({id: user._id.toString(),},"SECRET");
      return token;
    } catch (e) {
      throw new Error(e);
    }
  },
  getMessages: async (parent: unknown,args: {page:number, perPage:number}): Promise<Message[]> => {
    try {
      const schemas = await MessageCollection.find().skip(args.page*args.perPage).limit(args.perPage).toArray()
      const messages = schemas.map(x => x as unknown as Message);
      return messages;
      
    } catch (e) {
      throw new Error(e);
    }
  },
}