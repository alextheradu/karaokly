import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import type { Adapter, AdapterUser } from "next-auth/adapters"

// Wrap the Prisma adapter to strip emailVerified (not in our schema)
function stripEmailVerified(adapter: Adapter): Adapter {
  return {
    ...adapter,
    createUser: (data) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { emailVerified, ...rest } = data as AdapterUser & { emailVerified?: unknown }
      return adapter.createUser!(rest as Parameters<NonNullable<Adapter["createUser"]>>[0])
    },
    updateUser: (data) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { emailVerified, ...rest } = data as AdapterUser & { emailVerified?: unknown }
      return adapter.updateUser!(rest as Parameters<NonNullable<Adapter["updateUser"]>>[0])
    },
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: stripEmailVerified(PrismaAdapter(prisma as any)),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      session.user.isAdmin = (user as unknown as { isAdmin: boolean }).isAdmin ?? false
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
