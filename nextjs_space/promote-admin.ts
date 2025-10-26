import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function promoteToAdmin() {
  const updatedUser = await prisma.user.update({
    where: { email: "sebdev7688@gmail.com" },
    data: {
      role: "ADMIN",
      isApproved: true,
      approvedAt: new Date(),
      approvedBy: "admin@reelgen.ai"
    }
  });
  
  console.log("✅ Utilisateur mis à jour:", {
    email: updatedUser.email,
    role: updatedUser.role,
    isApproved: updatedUser.isApproved,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName
  });
  
  await prisma.$disconnect();
}

promoteToAdmin().catch(console.error);
