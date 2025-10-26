import { prisma } from './lib/db';

async function checkAuthStatus() {
  const user = await prisma.user.findUnique({
    where: { email: 'sebdev7688@gmail.com' }
  });
  
  console.log('Utilisateur trouvé:', user ? {
    email: user.email,
    name: user.name,
    isApproved: user.isApproved,
    role: user.role
  } : 'Non trouvé');
  
  if (user && !user.isApproved) {
    console.log('✅ Approbation de l utilisateur...');
    await prisma.user.update({
      where: { id: user.id },
      data: { isApproved: true }
    });
    console.log('✅ Utilisateur approuvé avec succès');
  } else if (user) {
    console.log('✅ Utilisateur déjà approuvé');
  }
}

checkAuthStatus()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
