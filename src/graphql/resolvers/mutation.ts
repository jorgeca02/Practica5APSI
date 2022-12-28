import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { decode } from "https://deno.land/x/djwt/mod.ts";

import { createJWT } from "../../jwt/jwt.ts";
import { MessageCollection, UserCollection } from "../../mongo/db.ts";
import { MessageSchema, UserSchema } from "../../mongo/schemas.ts";
import { Message } from "../../types.ts";


export const Mutation = {

    register: async (parent: unknown,args: {username: string,password: string}): Promise<UserSchema & { token: string }> => {
      try {
        const user: UserSchema | undefined = await UserCollection.findOne({username: args.username});
        if (user)throw new Error("User already exists");
        const date:string = new Date().toUTCString()
        const hashedPassword = await bcrypt.hash(args.password);
        const _id = new ObjectId();
        const token:string = await createJWT({id: _id.toString()},"SECRET");
        const newUser: UserSchema = {
          _id,
          username: args.username,
          password: hashedPassword,
          date:date
        };  
        await UserCollection.insertOne(newUser);
        return {...newUser,token,};
      } catch (e) {
        throw new Error(e);
      }
    },
    deleteUser: async(_: unknown,ctx:any): Promise<(UserSchema | undefined)> => {
      try{
        if(!context.auth)throw new Error("No login detected");
        const user=UserCollection.findOne({_id: new ObjectId(decode(ctx.auth)[1].id)});
        if(!user)throw new Error("Invalid login");
        UserCollection.deleteOne({_id: new ObjectId(decode(ctx.auth)[1].id)});
        return user
      }catch(e){
        console.error(e)
        throw new Error(e);
      }
    },

    sendMessage: async(parent: unknown,args: {message:string,destinatario:string},ctx:any): Promise<(Message | undefined)> => {
      try {
        const lang=ctx.lang
        const origen = await UserCollection.findOne({_id: new ObjectId(decode(ctx.auth)[1].id)}).username;
        const message:Message = {
          message:args.message,
          destinatario:args.destinatario,
          origen:decode(ctx.auth)[1].id,
          date: new Date().toUTCString(),
          lang: ctx.lang,
        };
        MessageCollection.insertOne(message as unknown as MessageSchema);
        return message;
      }catch(e){
          console.error(e)
          throw new Error(e);
      }
  }
  };