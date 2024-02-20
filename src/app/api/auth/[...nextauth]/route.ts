import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth/next";
import authOptiosn from "@/lib/nextauth-options";

const handler = NextAuth(authOptiosn);

export { handler as GET, handler as POST };
