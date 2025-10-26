
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create ADMIN user
  const adminPassword = await bcryptjs.hash("Admin123!@#", 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@reelgen.ai" },
    update: {
      role: "ADMIN",
      isApproved: true,
      approvedAt: new Date(),
    },
    create: {
      email: "admin@reelgen.ai",
      password: adminPassword,
      firstName: "Admin",
      lastName: "ReelGen",
      name: "Admin ReelGen",
      role: "ADMIN",
      isApproved: true,
      approvedAt: new Date(),
    },
  });

  console.log("✅ Created ADMIN user:", adminUser.email);
  console.log("   Email: admin@reelgen.ai");
  console.log("   Password: Admin123!@#");

  // Create default test user (requires approval)
  const hashedPassword = await bcryptjs.hash("johndoe123", 12);
  
  const testUser = await prisma.user.upsert({
    where: { email: "john@doe.com" },
    update: {},
    create: {
      email: "john@doe.com",
      password: hashedPassword,
      firstName: "John",
      lastName: "Doe",
      name: "John Doe",
      role: "USER",
      isApproved: false, // Requires admin approval
    },
  });

  console.log("✅ Created test user:", testUser.email, "(Requires approval)");
  console.log("\n🔒 Security enabled: New users require admin approval");
  console.log("Database seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
