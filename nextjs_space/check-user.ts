import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: "sebdev7688@gmail.com" }
  });
  
  if (user) {
    console.log("✅ Utilisateur trouvé:", {
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      firstName: user.firstName,
      lastName: user.lastName
    });
  } else {
    console.log("❌ Utilisateur non trouvé");
  }
  
  await prisma.$disconnect();
}

checkUser().catch(console.error);
