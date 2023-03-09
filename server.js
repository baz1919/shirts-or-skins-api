import express from "express";
import cors from "cors";
import { expressjwt } from "express-jwt";
import { User } from "./db.js";
import jwt from "jsonwebtoken";
import { createServer  as createHttpServer } from "http";
import { WebSocketServer } from "ws";
import { readFile } from "fs/promises";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { useServer as useWsServer } from "graphql-ws/lib/use/ws";

import { resolvers } from "./graphql/resolvers/index.js"

const PORT = 9000;
const JWT_SECRET = Buffer.from("672b4d1d434b1bc0bad6a33c081a83fbf8d67580ea302344e3d4414eb806eeae", "base64");
const GQL_ROUTE = "/graphql";
const LOGIN_ROUTE = "/login";

// Express
const app = express();
app.use(
    cors(),
    express.json(),
    expressjwt({
        algorithms: ["HS256"],
        credentialsRequired: false,
        secret: JWT_SECRET,
    })
);
// Routes
app.post("/login", async (req, res) => {
    const {userId, password} = req.body;
    const user = await User.findOne((user) => user.id === userId);
    if (user && user.password === password) {
        const token = jwt.sign({ sub: user.id }, JWT_SECRET);
        res.json({ token });
    } else {
        res.sendStatus(401);
    }
});

app.get("login", async (req, res) => {
    res.sendStatus(405);
})

// Contexts
const getHttpContext = ({ req }) => (req.auth ? { userId: req.auth.sub } : {});
const getWsContext = ({ connectionParams }) => {
    const token = connectionParams?.accessToken;
    if (token) {
        const payload = jwt.verify(token, JWT_SECRET);
        return { userId: payload.sub};
    }
    return {};
}

// Protocol Servers
const httpServer = createHttpServer(app);
const wsServer = new WebSocketServer({ server: httpServer, path: GQL_ROUTE });

// Schema Setup
const typeDefs = await readFile("./graphql/schema/schema.graphql", "utf-8");
const schema = makeExecutableSchema({typeDefs, resolvers});
useWsServer({schema, context: getWsContext }, wsServer)

// Apollo Server
const apolloServer = new ApolloServer({
    schema,
    context: getHttpContext,
});
await apolloServer.start();
app.use(
    GQL_ROUTE,
    expressMiddleware(apolloServer, {context: getHttpContext})
);

httpServer.listen({ port: PORT}, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Login endpoint: http://localhost${PORT}${LOGIN_ROUTE}`)
    console.log(`GraphQL endpoint: http://localhost:${PORT}${GQL_ROUTE}`);
});
