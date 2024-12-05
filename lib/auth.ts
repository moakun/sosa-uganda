import { db } from "./db";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { User } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!existingUser) {
          return null;
        }

        const passwordMatch = await compare(credentials.password, existingUser.password);

        if (!passwordMatch) {
          return null;
        }

        // Ensure the returned object matches the expected User type
        return {
          id: existingUser.id.toString(),  // id is still required
          email: existingUser.email,
          fullName: existingUser.fullName,
          companyName: existingUser.companyName,
          image: null, // Optional: set this if you have an image
          name: existingUser.fullName, // Required: this can be the full name or another field
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Store user information in JWT token
        return {
          ...token,
          email: user.email,
          fullName: user.fullName,
          companyName: user.companyName,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Add token data to the session
      return {
        ...session,
        user: {
          ...session.user,
          email: token.email,
          fullName: token.fullName,
          companyName: token.companyName,
        },
      };
    },
  },
};
