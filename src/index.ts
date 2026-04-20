import "dotenv/config";
import { createYoga } from "graphql-yoga";
import { createServer } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import { startListener } from "./listener.js";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as `0x${string}`;
const CELO_RPC_URL = process.env.CELO_RPC_URL ?? "https://forno.celo.org";
const START_BLOCK = BigInt(process.env.START_BLOCK ?? "0");
const PORT = Number(process.env.PORT ?? 4000);

if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS is required");

const schema = makeExecutableSchema({ typeDefs, resolvers });

const yoga = createYoga({ schema });
const server = createServer(yoga);

server.listen(PORT, () => {
  console.log(`GraphQL server running at http://localhost:${PORT}/graphql`);
});

startListener(CONTRACT_ADDRESS, CELO_RPC_URL, START_BLOCK);
