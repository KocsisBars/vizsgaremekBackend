import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const adminUsername = 'admin';
  const adminExists = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!adminExists) {
    const hashedPassword = await argon2.hash('Adminpass123!'); 

    await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Default admin user created.');
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });