import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample FoodItem entries with categories
  const foodItems = await prisma.foodItem.createMany({
    data: [
      // Fruits
      {
        name: 'Apple',
        unit: 'pcs',
        category: 'fruit',
        typicalExpirationDays: 7,
        sampleCostPerUnit: 0.5,
        description: 'Fresh red apples'
      },
      {
        name: 'Banana',
        unit: 'pcs',
        category: 'fruit',
        typicalExpirationDays: 5,
        sampleCostPerUnit: 0.3,
        description: 'Ripe yellow bananas'
      },
      {
        name: 'Orange',
        unit: 'pcs',
        category: 'fruit',
        typicalExpirationDays: 14,
        sampleCostPerUnit: 0.6,
        description: 'Fresh oranges'
      },
      {
        name: 'Grapes',
        unit: 'kg',
        category: 'fruit',
        typicalExpirationDays: 5,
        sampleCostPerUnit: 3.0,
        description: 'Green seedless grapes'
      },
      {
        name: 'Strawberries',
        unit: 'kg',
        category: 'fruit',
        typicalExpirationDays: 3,
        sampleCostPerUnit: 4.5,
        description: 'Fresh strawberries'
      },

      // Vegetables
      {
        name: 'Carrots',
        unit: 'kg',
        category: 'vegetable',
        typicalExpirationDays: 21,
        sampleCostPerUnit: 1.2,
        description: 'Fresh carrots'
      },
      {
        name: 'Lettuce',
        unit: 'pcs',
        category: 'vegetable',
        typicalExpirationDays: 7,
        sampleCostPerUnit: 1.5,
        description: 'Fresh lettuce'
      },
      {
        name: 'Tomato',
        unit: 'kg',
        category: 'vegetable',
        typicalExpirationDays: 5,
        sampleCostPerUnit: 2.0,
        description: 'Fresh tomatoes'
      },
      {
        name: 'Potato',
        unit: 'kg',
        category: 'vegetable',
        typicalExpirationDays: 30,
        sampleCostPerUnit: 0.8,
        description: 'White potatoes'
      },
      {
        name: 'Onion',
        unit: 'kg',
        category: 'vegetable',
        typicalExpirationDays: 60,
        sampleCostPerUnit: 0.6,
        description: 'Yellow onions'
      },

      // Dairy
      {
        name: 'Milk',
        unit: 'litre',
        category: 'dairy',
        typicalExpirationDays: 7,
        sampleCostPerUnit: 1.2,
        description: 'Whole milk, 1L'
      },
      {
        name: 'Cheese',
        unit: 'kg',
        category: 'dairy',
        typicalExpirationDays: 21,
        sampleCostPerUnit: 8.0,
        description: 'Cheddar cheese'
      },
      {
        name: 'Eggs',
        unit: 'dozen',
        category: 'dairy',
        typicalExpirationDays: 28,
        sampleCostPerUnit: 2.5,
        description: 'Large white eggs'
      },

      // Grains
      {
        name: 'Bread',
        unit: 'pcs',
        category: 'grain',
        typicalExpirationDays: 5,
        sampleCostPerUnit: 2.5,
        description: 'Whole wheat bread'
      },
      {
        name: 'Rice',
        unit: 'kg',
        category: 'grain',
        typicalExpirationDays: 365,
        sampleCostPerUnit: 1.8,
        description: 'Long grain white rice'
      },
      {
        name: 'Pasta',
        unit: 'kg',
        category: 'grain',
        typicalExpirationDays: 365,
        sampleCostPerUnit: 1.2,
        description: 'Spaghetti pasta'
      },

      // Proteins
      {
        name: 'Chicken Breast',
        unit: 'kg',
        category: 'protein',
        typicalExpirationDays: 2,
        sampleCostPerUnit: 8.0,
        description: 'Fresh chicken breast'
      },
      {
        name: 'Ground Beef',
        unit: 'kg',
        category: 'protein',
        typicalExpirationDays: 2,
        sampleCostPerUnit: 10.0,
        description: 'Lean ground beef'
      },

      // Pantry
      {
        name: 'Olive Oil',
        unit: 'litre',
        category: 'pantry',
        typicalExpirationDays: 365,
        sampleCostPerUnit: 12.0,
        description: 'Extra virgin olive oil'
      },
      {
        name: 'Honey',
        unit: 'kg',
        category: 'pantry',
        typicalExpirationDays: 730,
        sampleCostPerUnit: 8.0,
        description: 'Pure honey'
      }
    ],
    skipDuplicates: true,
  });

  console.log(`Seeded ${foodItems.count} food items`);

  // Create sample Resource entries
  // const resources = await prisma.resource.createMany({
  //   data: [
  //     {
  //       title: 'Food Storage Tips',
  //       description: 'Best practices for storing food to reduce waste',
  //       url: 'https://example.com/food-storage-tips',
  //     },
  //     {
  //       title: 'Meal Planning Guide',
  //       description: 'How to plan meals effectively to minimize waste',
  //       url: 'https://example.com/meal-planning',
  //     },
  //     {
  //       title: 'Waste Reduction Techniques',
  //       description: 'Methods to reduce food waste at home',
  //       url: 'https://example.com/waste-reduction',
  //     }
  //   ],
  //   skipDuplicates: true,
  // });

  // console.log(`Seeded ${resources.count} resources`);

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