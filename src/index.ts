import datasource from "./utils";
import { ApolloServer } from "apollo-server";
import { WildersResolver } from "./resolvers/Wilders";
import { buildSchema } from "type-graphql";
import { UpvotesResolver } from "./resolvers/Upvotes";
import { SkillsResolver } from "./resolvers/Skills";


const PORT = 5000 ;

async function bootstrap(): Promise<void> {
  // ... Building schema here
  const schema = await buildSchema({
    resolvers: [WildersResolver, UpvotesResolver, SkillsResolver],
  });
  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
  });

  // Start the server
  const { url } = await server.listen(PORT);
  console.log(`Server is running, GraphQL Playground available at ${url}`);

  try {
    await datasource.initialize();
    console.log("I'm connected!");
  } catch (err) {
    console.log("Dommage");
    console.error(err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();


