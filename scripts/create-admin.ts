import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import logger from "@/utils/logger";

async function createAdmin() {
  // Validate DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL environment variable is not set.");
    console.error(
      "Please create a .env file with DATABASE_URL=your_connection_string"
    );
    process.exit(1);
  }

  const email = process.argv[2] || "admin@example.com";
  const password = process.argv[3] || "admin123";
  const name = process.argv[4] || "Admin User";

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logger.debug(`User with email ${email} already exists.`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name: name.split(" ")[0],
        last_name: name.split(" ")[1],
        role: "ADMIN",
        username: email.split("@")[0].toLowerCase(),
      },
    });

    logger.debug(`Admin user created successfully!`);
    logger.debug(`Email: ${user.email}`);
    logger.debug(`Username: ${user.username}`);
    logger.debug(`Name: ${user.first_name} ${user.last_name}`);
    logger.debug(`Role: ${user.role}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
