import { NextAuthOptions, getServerSession } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import SpotifyProvider from "next-auth/providers/spotify";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { nanoid } from "nanoid";

import { db } from "./db";

const options: NextAuthOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    // SpotifyProvider({
    //   clientId: process.env.SPOTIFY_CLIENT_ID!,
    //   clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    // }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GIHTUB_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token?.email,
        },
      });

      if (!dbUser) {
        token.id = user?.id;
        return token;
      }

      if (!dbUser?.username) {
        await db.user.update({
          where: {
            id: dbUser?.id,
          },
          data: {
            username: nanoid(10),
          },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
};

export const getUserSession = () => getServerSession(options);

export default options;
