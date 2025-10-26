
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Afficher tous les utilisateurs actuels
    console.log('\n=== Utilisateurs actuels ===');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isApproved: true
      }
    });
    console.table(users);

    // Révoquer l'administrateur AdminReelGen
    const adminReelGen = await prisma.user.findUnique({
      where: { email: 'admin@reelgen.ai' }
    });

    if (adminReelGen) {
      // Supprimer complètement l'utilisateur AdminReelGen
      await prisma.user.delete({
        where: { email: 'admin@reelgen.ai' }
      });
      console.log('\n✅ Administrateur AdminReelGen supprimé avec succès');
    } else {
      console.log('\n⚠️  Administrateur AdminReelGen introuvable');
    }

    // Vérifier que sebdev7688@gmail.com est bien admin
    const sebAdmin = await prisma.user.findUnique({
      where: { email: 'sebdev7688@gmail.com' }
    });

    if (sebAdmin) {
      if (sebAdmin.role !== 'ADMIN') {
        await prisma.user.update({
          where: { email: 'sebdev7688@gmail.com' },
          data: { role: 'ADMIN', isApproved: true }
        });
        console.log('✅ sebdev7688@gmail.com confirmé comme ADMIN');
      } else {
        console.log('✅ sebdev7688@gmail.com est déjà ADMIN');
      }
    }

    // Afficher la liste finale
    console.log('\n=== Utilisateurs après révocation ===');
    const finalUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isApproved: true
      }
    });
    console.table(finalUsers);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
