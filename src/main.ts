import { ApolloServer } from "npm:@apollo/server@^4.1";
import { startStandaloneServer } from "npm:@apollo/server@^4.1/standalone";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

import {Mutation} from "./graphql/resolvers/mutation.ts";
import {typeDefs} from "./graphql/types.ts";
import { Query } from "./graphql/resolvers/query.ts";

const resolvers = {
    Mutation,
    Query
} 
const server = new ApolloServer({
   typeDefs,
   resolvers,
});
const _port = Deno.env.get("PORT")

const { url } = await startStandaloneServer(server, {
    listen: { port:_port },
    context:({req})=>{

        const lang:String = req.headers.lang
        const auth:String = req.headers.auth  
        
        return{
            lang,auth
        }

    }
});

console.log(`server running on: ${url}`);