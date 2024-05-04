import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const admin_user = await prisma.adminUser.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'passw0rd',
      name: 'Alice',
    },
  });
  console.log({ admin_user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
