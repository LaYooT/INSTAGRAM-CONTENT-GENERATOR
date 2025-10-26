import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function resetPassword() {
  const newPassword = "AdminSeb2025!";
  const hashedPassword = await bcryptjs.hash(newPassword, 12);
  
  const updatedUser = await prisma.user.update({
    where: { email: "sebdev7688@gmail.com" },
    data: {
      password: hashedPassword
    }
  });
  
  console.log("✅ Mot de passe réinitialisé pour:", updatedUser.email);
  console.log("   Nouveau mot de passe:", newPassword);
  
  await prisma.$disconnect();
}

resetPassword().catch(console.error);
