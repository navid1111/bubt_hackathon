import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample FoodItem entries
  const foodItems = await prisma.foodItem.createMany({
    data: [
      {
        name: 'Apple',
        unit: 'pcs',
        typicalExpirationDays: 7,
        sampleCostPerUnit: 0.5,
        description: 'Fresh red apples'
      },
      {
        name: 'Banana',
        unit: 'pcs',
        typicalExpirationDays: 5,
        sampleCostPerUnit: 0.3,
        description: 'Ripe yellow bananas'
      },

      {
        name: 'Milk',
        unit: 'litre',
        typicalExpirationDays: 7,
        sampleCostPerUnit: 1.2,
        description: 'Whole milk, 1L'
      },
      {
        name: 'Bread',
        unit: 'pcs',
        typicalExpirationDays: 5,
        sampleCostPerUnit: 2.5,
        description: 'Whole wheat bread'
      }
    ],
    skipDuplicates: true,
  });

  console.log(`Seeded ${foodItems.count} food items`);

  // Create sample Resource entries
  const resources = await prisma.resource.createMany({
    data: [
      {
        title: 'Food Storage Tips',
        description: 'Best practices for storing food to reduce waste',
        url: 'https://example.com/food-storage-tips',
      },
      {
        title: 'Meal Planning Guide',
        description: 'How to plan meals effectively to minimize waste',
        url: 'https://example.com/meal-planning',
      },
      {
        title: 'Waste Reduction Techniques',
        description: 'Methods to reduce food waste at home',
        url: 'https://example.com/waste-reduction',
      }
    ],
    skipDuplicates: true,
  });

  console.log(`Seeded ${resources.count} resources`);

  // Create sample user
  const user = await prisma.user.upsert({
    where: { clerkId: 'user_123' },
    update: {},
    create: {
      clerkId: 'user_123',
      email: 'demo@example.com',
    },
  });

  console.log(`Seeded user with ID: ${user.id}`);

  // Create inventory for the user
  const inventory = await prisma.inventory.create({
    data: {
      name: 'Home Inventory',
      description: 'Main home food inventory',
      isPrivate: false,
      createdById: user.id,
    },
  });

  console.log(`Seeded inventory with ID: ${inventory.id}`);

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });