const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const cors = require('cors')
const dotEnv = require('dotenv')

const { tasks, users } = require('./constants')

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
    tasks: [Task!]
    task(id: ID!): Task
    users: [User!]
    user(id: ID!): User
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
    greetings: () => null,
    tasks: () => {
      return tasks
    },
    task: (_, { id }) => {
      return tasks.find(task => task.id === id)
    },
    users: () => users,
    user: (_, { id }) => {
      return users.find(user => user.id === id)
    }
  },
  Task: {
    // find the user that matches userId of task
    // note: {userId} = parent.userId
    user: ({ userId }) => users.find(users => user.id === userId)
  },
  User: {
    tasks: ({ id }) => tasks.find(task => task.userId === id)
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


