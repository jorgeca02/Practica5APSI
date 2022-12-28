import { gql } from 'https://deno.land/x/graphql_tag@0.0.1/mod.ts'

export const typeDefs =gql`

type User{
    id: String!
    username: String!
    date:String!
}
type Message{
    id:String!
    message:String!
    destinatario:String!
    date:String!
    origen:String!
    lang:String!
}
type Mutation{
    register(username:String!, password:String!): User
    deleteUser: User
    sendMessage(destinatario:String!, message:String!): Message
}
type Query {
    login(username:String!, password:String!):String!
    getMessages(page:Int!, perPage:Int!): [Message]!
} 
`;