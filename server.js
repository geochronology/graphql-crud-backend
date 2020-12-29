const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const cors = require('cors')
const dotEnv = require('dotenv')

// set env variables
dotEnv.config()

const app = express()

// cors
app.use(cors())

// body parser middleware
app.use(express.json())


// gql
const typeDefs = gql`
  type Query {
    greetings: [String!]
    task: [Task!]
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
  }
  
  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    user: User!
  } 
`

const resolvers = {
  Query: {
    greetings: () => null
  }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
})

apolloServer.applyMiddleware({ app, path: '/graphql' })

// server
const PORT = process.env.PORT || 3000

app.use('/', (req, res, next) => res.send({ message: 'hello' }))

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
  console.log(`GraphQL endpoint: ${apolloServer.graphqlPath}`)
})


