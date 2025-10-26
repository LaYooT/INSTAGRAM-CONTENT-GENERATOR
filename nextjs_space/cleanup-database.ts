
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('\n=== Utilisateurs actuels ===');
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isApproved: true
      }
    });
    console.table(allUsers);

    // Supprimer TOUS les utilisateurs sauf sebdev7688@gmail.com
    const usersToDelete = allUsers.filter(user => user.email !== 'sebdev7688@gmail.com');
    
    console.log(`\n🗑️  Suppression de ${usersToDelete.length} utilisateur(s)...`);
    
    for (const user of usersToDelete) {
      await prisma.user.delete({
        where: { id: user.id }
      });
      console.log(`✅ Supprimé: ${user.email} (${user.name})`);
    }

    // Vérifier que sebdev7688@gmail.com est bien admin et approuvé
    const sebAdmin = await prisma.user.findUnique({
      where: { email: 'sebdev7688@gmail.com' }
    });

    if (sebAdmin) {
      if (sebAdmin.role !== 'ADMIN' || !sebAdmin.isApproved) {
        await prisma.user.update({
          where: { email: 'sebdev7688@gmail.com' },
          data: { 
            role: 'ADMIN', 
            isApproved: true 
          }
        });
        console.log('\n✅ sebdev7688@gmail.com confirmé comme ADMIN approuvé');
      }
    }

    console.log('\n=== Utilisateurs après nettoyage ===');
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

    if (finalUsers.length === 1 && finalUsers[0].email === 'sebdev7688@gmail.com') {
      console.log('\n✅ SUCCESS: sebdev7688@gmail.com est maintenant le SEUL utilisateur de l\'application');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
