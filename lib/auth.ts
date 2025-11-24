import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import logger from "@/utils/logger";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const attemptBackendLogin = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    logger.error("User not found for email", email);
    return null;
  }

  if (!user.is_active) {
    logger.error("User inactive", email);
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    logger.error("Password mismatch for email", email);
    return null;
  }

  return user;
};

const attemptBackendRegister = async ({
  email,
  username,
  password,
  firstName,
  lastName,
}: {
  email: string;
  username: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    logger.error("Registration attempted with existing email", email);
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      first_name: firstName ?? null,
      last_name: lastName ?? null,
    },
  });

  return newUser;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
        name: { label: "Name", type: "text" },
        mode: { label: "Mode", type: "text" },
      },
      async authorize(credentials) {
        try {
          const mode = credentials?.mode?.toLowerCase();
          const isRegister = mode === "register";
          const email = credentials?.email?.trim();
          const password = credentials?.password ?? "";
          const username = credentials?.username?.trim();
          const fullName = credentials?.name?.trim();

          if (!email || !password) {
            logger.error("Missing email or password");
            return null;
          }

          if (isRegister && (!username || !fullName)) {
            logger.error("Missing username or name for registration");
            return null;
          }

          let user;

          if (isRegister) {
            const [firstName, ...rest] = (fullName ?? "").split(" ").filter(Boolean);
            user = await attemptBackendRegister({
              email,
              username: username ?? "",
              password,
              firstName: firstName || null,
              lastName: rest.length ? rest.join(" ") : null,
            });
          } else {
            user = await attemptBackendLogin(email, password);
          }

          if (!user) {
            return null;
          }

          const name =
            (user.first_name || user.last_name) &&
            [user.first_name, user.last_name].filter(Boolean).join(" ");

          return {
            id: String(user.user_id),
            email: user.email,
            username: user.username,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            name: name || user.username || user.email,
          };
        } catch (error) {
          logger.error("Authorize error", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.user = {
          id: (user as any).id,
          email: (user as any).email,
          username: (user as any).username,
          role: (user as any).role,
          firstName: (user as any).firstName,
          lastName: (user as any).lastName,
          name: (user as any).name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        ...(token.user as any),
        id: token.id as string,
        role: token.role as string,
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.NEXT_PUBLIC_NEXTAUTH_SECRET, // Use NEXTAUTH_SECRET first, fallback to NEXT_PUBLIC
  debug: process.env.NODE_ENV !== "production",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};