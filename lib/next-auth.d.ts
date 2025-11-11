// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      token?: string;
      role: string;
      customer?: unknown;
    };
    provider?: string;
    accessToken?: string;
    customer?: unknown;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    token?: string;
    customer?: unknown;
    role: string;

  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    role: string;
    session?: unknown;
  }
}
