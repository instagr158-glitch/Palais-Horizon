import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
      }
      if (token.uid) {
        // Refresh subscription status on every request so gating stays current.
        const dbUser = await prisma.user.findUnique({
          where: { id: token.uid as string },
          select: {
            subscriptionStatus: true,
            plan: true,
            currentPeriodEnd: true,
            role: true,
          },
        });
        token.subscriptionStatus = dbUser?.subscriptionStatus ?? "none";
        token.plan = dbUser?.plan ?? null;
        token.currentPeriodEnd = dbUser?.currentPeriodEnd
          ? dbUser.currentPeriodEnd.toISOString()
          : null;
        token.role = dbUser?.role ?? "member";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.subscriptionStatus =
          (token.subscriptionStatus as string) ?? "none";
        session.user.plan = (token.plan as string | null) ?? null;
        session.user.currentPeriodEnd =
          (token.currentPeriodEnd as string | null) ?? null;
        session.user.role = (token.role as string) ?? "member";
      }
      return session;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}
