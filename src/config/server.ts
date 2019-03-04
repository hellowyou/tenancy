import { GraphQLServer } from 'graphql-yoga';
import { Options } from 'graphql-yoga';
import { prismaObjectType, makePrismaSchema } from 'nexus-prisma';
import { stringArg, idArg } from 'nexus';
import * as path from 'path';

import { prisma } from '../generated/prisma-client';
import datamodelInfo from '../generated/nexus-prisma'
const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`
  }
};

const Query = prismaObjectType({
  name: 'Query',
  definition(t) {
    t.prismaFields(['*'])
    // t.list.field('feed', {
    //   type: 'Post',
    //   resolve: (_, args, ctx) => ctx.prisma.posts({ where: { published: true } })
    // })
    // t.list.field('postsByUser', {
    //   type: 'Post',
    //   args: { email: stringArg() },
    //   resolve: (_, { email }, ctx) => ctx.prisma.posts({ where: { author: { email } } })
    // })
  }
})

const Mutation = prismaObjectType({
  name: 'Mutation',
  definition(t) {
    t.prismaFields(['createUser', 'updateUser', 'deleteUser']);
    // t.field('createDraft', {
    //   type: 'Post',
    //   args: {
    //     title: stringArg(),
    //     authorId: idArg({ nullable: true })
    //   },
    //   resolve: (_, { title, authorId }, ctx) => ctx.prisma.createPost({
    //     title,
    //     author: { connect: { id: authorId }}
    //   })
    // });
    // t.field('publish', {
    //   type: 'Post',
    //   nullable: true,
    //   args: { id: idArg() },
    //   resolve: (_, { id }, ctx) => ctx.prisma.updatePost({
    //     where: { id },
    //     data: { published: true }
    //   })
    // });
  }
});

const schema = makePrismaSchema({
  types: [Query, Mutation],

  prisma: {
    datamodelInfo,
    client: prisma
  },

  outputs: {
    schema: path.join(__dirname, '../generated/schema.graphql'),
    typegen: path.join(__dirname, '../generated/nexus.ts'),
  },
});

export const server = new GraphQLServer({
  schema,
  resolvers,
  context: req => ({ db: prisma })
});

export async function startServer() {
  const opts: Options = {
    port: process.env.PORT || 3000,
  };

  return server.start(opts).then(s => {
    console.log('Server ready at http://localhost:' + 3000);

    return s;
  });
}
