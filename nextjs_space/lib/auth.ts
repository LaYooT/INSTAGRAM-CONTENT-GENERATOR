
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { prisma } from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          throw new Error("Email ou mot de passe incorrect");
        }

        const isPasswordValid = await bcryptjs.compare(
          credentials.password,
          user.password || ''
        );

        if (!isPasswordValid) {
          throw new Error("Email ou mot de passe incorrect");
        }

        // Check if user is approved
        if (!user.isApproved) {
          throw new Error("Votre compte n'a pas encore été approuvé par l'administrateur. Veuillez patienter.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isApproved: user.isApproved,
        };
      }
    })
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          firstName: token.firstName,
          lastName: token.lastName,
          role: token.role,
          isApproved: token.isApproved,
        }
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          firstName: (user as any).firstName,
          lastName: (user as any).lastName,
          role: (user as any).role,
          isApproved: (user as any).isApproved,
        };
      }
      return token;
    }
  }
};
