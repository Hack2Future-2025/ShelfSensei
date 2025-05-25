import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clean up existing data
    await prisma.$executeRaw`TRUNCATE TABLE "product_in" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "product" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "shop" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "category" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "vendors" CASCADE`;

    // Create a test user
    const user = await prisma.user.create({
        data: {
            name: 'Test User'
        }
    });

    // Create test category
    const category = await prisma.category.create({
        data: {
            name: 'Electronics'
        }
    });

    // Create test vendor
    const vendor = await prisma.vendor.create({
        data: {
            name: 'Main Supplier'
        }
    });

    // Create shops
    const shopNames = [
        'Main Street Store',
        'Downtown Branch',
        'Shopping Mall Outlet',
        'Express Corner',
        'Wholesale Center'
    ];

    const shops = await Promise.all(
        shopNames.map(name => 
            prisma.shop.create({
                data: {
                    name,
                    usr_id: user.id
                }
            })
        )
    );

    // Create products
    const productData = [
        { name: 'Laptop Pro X', price: 1299.99 },
        { name: 'Smartphone Y20', price: 699.99 },
        { name: 'Wireless Earbuds', price: 129.99 },
        { name: 'Smart Watch Elite', price: 249.99 },
        { name: 'Tablet Air', price: 449.99 },
        { name: 'Gaming Console X', price: 499.99 },
        { name: '4K Monitor', price: 399.99 },
        { name: 'Wireless Keyboard', price: 79.99 },
        { name: 'Bluetooth Speaker', price: 89.99 },
        { name: 'Power Bank 20000mAh', price: 49.99 }
    ];

    const products = await Promise.all(
        productData.map(product => 
            prisma.product.create({
                data: {
                    name: product.name,
                    price: product.price,
                    cat_id: category.id
                }
            })
        )
    );

    // Generate 90 days of inventory movements
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);

    for (let i = 0; i < 90; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);

        // Generate 3-7 movements per day
        const movementsPerDay = Math.floor(Math.random() * 5) + 3;

        for (let j = 0; j < movementsPerDay; j++) {
            const shop = shops[Math.floor(Math.random() * shops.length)];
            const product = products[Math.floor(Math.random() * products.length)];
            const type = Math.random() < 0.6 ? 'IN' : 'OUT';
            const quantity = Math.floor(Math.random() * 19) + 1;
            const timestamp = new Date(currentDate);
            timestamp.setHours(Math.floor(Math.random() * 24));

            await prisma.productIn.create({
                data: {
                    shop_id: shop.id,
                    prod_id: product.id,
                    ven_id: vendor.id,
                    type: type,
                    quantity: quantity,
                    price: product.price,
                    createdAt: timestamp
                }
            });
        }
    }

    // Add specific patterns for top products
    for (let shop of shops) {
        for (let product of products.slice(0, 3)) { // Top 3 products
            // Weekly replenishment
            for (let week = 1; week <= 12; week++) {
                const date = new Date();
                date.setDate(date.getDate() - (week * 7));
                
                if (Math.random() < 0.9) { // 90% consistency
                    await prisma.productIn.create({
                        data: {
                            shop_id: shop.id,
                            prod_id: product.id,
                            ven_id: vendor.id,
                            type: 'IN',
                            quantity: 10,
                            price: product.price,
                            createdAt: date
                        }
                    });
                }
            }
        }
    }

    console.log('Database has been seeded. 🌱');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 