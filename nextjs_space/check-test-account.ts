import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Vérifier si le compte de test existe
    const testAccount = await prisma.user.findUnique({
      where: { email: 'john@doe.com' }
    });

    if (!testAccount) {
      console.log('❌ Compte de test john@doe.com introuvable');
      console.log('✅ Création du compte de test...');
      
      const hashedPassword = await bcrypt.hash('johndoe123', 10);
      await prisma.user.create({
        data: {
          email: 'john@doe.com',
          name: 'John Doe',
          password: hashedPassword,
          role: 'ADMIN',
          isApproved: true
        }
      });
      
      console.log('✅ Compte de test créé avec succès');
    } else {
      console.log('✅ Compte de test existant:', {
        email: testAccount.email,
        name: testAccount.name,
        role: testAccount.role,
        isApproved: testAccount.isApproved
      });
      
      // S'assurer que le compte est approuvé et admin
      if (!testAccount.isApproved || testAccount.role !== 'ADMIN') {
        await prisma.user.update({
          where: { email: 'john@doe.com' },
          data: {
            role: 'ADMIN',
            isApproved: true
          }
        });
        console.log('✅ Compte de test mis à jour (ADMIN + approuvé)');
      }
    }

    // Afficher tous les comptes
    console.log('\n=== Tous les utilisateurs ===');
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        isApproved: true
      }
    });
    console.table(allUsers);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
