// For real world implementation, see recommendations on: https://github.com/apollographql/graphql-subscriptions
import { queryResolvers } from "./query.js";
// import { mutationResolvers } from "./mutation.js";
// import { subscriptionResolvers } from "./subscription.js";

// import { PubSub } from "graphql-subscriptions";

// const pubSub = new PubSub();

export const resolvers = {
  Query: queryResolvers(),
//   Mutation: mutationResolvers(pubSub),
//   Subscription: subscriptionResolvers(pubSub),
};

export default resolvers;
