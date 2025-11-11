// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";

export async function POST(req: Request) {
  const { username,email, password } = await req.json();
  logger.debug(email, password, "email, password");
  const hashedPassword = await bcrypt.hash(password, 10);
  logger.debug(hashedPassword, "hashedPassword");
  await prisma.user.create({
    data: {
      username: username,
      email,
      password: hashedPassword,
      role: "EDITOR",
    },
  });
  logger.debug("User created");
  return NextResponse.json({ ok: true });
}
