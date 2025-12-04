import { PrismaClient, Role, LicenseStatus } from '@prisma/client';

const prisma = new PrismaClient();

const getExpiryDate = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

async function main() {
  console.log('Start seeding...');

  // Clean up existing records
  await prisma.license.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleaned up existing User and License records.');
  
  // --- Create Official User (admin-like) ---
  const officialUser = await prisma.user.upsert({
    where: { email: 'official@locoverify.com' },
    update: {},
    create: {
      email: 'official@locoverify.com',
      password: 'hashed_official_password_123',
      name: 'System Official',
      role: Role.ADMIN,          // ✅ FIXED
    },
  });
  console.log(`Created Official User: ${officialUser.email}`);

  // --- Create Vendor Users and Licenses ---
  const vendor1 = await prisma.user.upsert({
    where: { email: 'vendor1@shop.com' },
    update: {},
    create: {
      email: 'vendor1@shop.com',
      password: 'hashed_vendor_password_123',
      name: 'Jane Doe',
      shopName: "Jane's Fresh Produce",
      phone: '555-0101',
      role: Role.VENDOR,        // ✅ FIXED
      licenses: {
        create: {
          licenseType: 'Food Vendor Permit',
          status: LicenseStatus.APPROVED,
          issueDate: new Date(),
          expiryDate: getExpiryDate(365),
          idProofLink: 'https://cdn.locoverify.com/docs/vendor1_id',
          shopPhotoLink: 'https://cdn.locoverify.com/photos/vendor1_shop',
        },
      },
    },
  });
  console.log(`Created Vendor 1 (Approved): ${vendor1.email}`);
}

main()
  .catch((e) => {
    console.error('Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
