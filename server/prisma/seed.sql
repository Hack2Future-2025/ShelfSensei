-- Clear existing data
TRUNCATE TABLE "product_in", "product", "category", "shop", "User", "vendors" CASCADE;

-- Reset sequences
ALTER SEQUENCE category_id_seq RESTART WITH 1;
ALTER SEQUENCE product_id_seq RESTART WITH 1;
ALTER SEQUENCE "User_id_seq" RESTART WITH 1;
ALTER SEQUENCE shop_id_seq RESTART WITH 1;
ALTER SEQUENCE vendors_id_seq RESTART WITH 1;
ALTER SEQUENCE product_in_id_seq RESTART WITH 1;

-- Insert Categories with unique names
INSERT INTO category (name) VALUES
('Electronics'),
('Furniture'),
('Clothing'),
('Books'),
('Sports & Fitness'),
('Food & Beverages'),
('Health & Beauty'),
('Home & Garden'),
('Toys & Games'),
('Office Supplies'),
('Automotive'),
('Pet Supplies'),
('Musical Instruments'),
('Art & Crafts'),
('Jewelry & Accessories'),
('Baby & Kids'),
('Outdoor & Camping'),
('Tools & Hardware'),
('Stationery'),
('Kitchen & Dining');

-- Insert Users (100 users)
INSERT INTO "User" (name)
SELECT 'User ' || generate_series(1, 100);

-- Insert Vendors
INSERT INTO vendors (name) VALUES
('Apple Inc.'),
('Samsung Electronics'),
('Sony Corporation'),
('Dell Technologies'),
('HP Inc.'),
('IKEA'),
('Nike'),
('Adidas'),
('Penguin Random House'),
('Procter & Gamble'),
('Johnson & Johnson'),
('Nestlé'),
('Unilever'),
('The Home Depot'),
('Best Buy'),
('Target'),
('Walmart'),
('Amazon Basics'),
('Logitech'),
('Microsoft'),
('Lenovo'),
('ASUS'),
('LG Electronics'),
('Canon'),
('Hasbro'),
('Mattel'),
('Staples'),
('Office Depot'),
('PetSmart'),
('Yamaha'),
('Fender'),
('Bosch'),
('Black & Decker'),
('3M'),
('Philips'),
('Panasonic'),
('Toshiba'),
('Whirlpool'),
('KitchenAid'),
('Dyson'),
('Coleman'),
('North Face'),
('Lego'),
('Fisher-Price'),
('Crayola'),
('Steelcase'),
('Herman Miller'),
('Epson'),
('Brother');

-- Insert Products with realistic names and prices
INSERT INTO product (name, cat_id, price) VALUES
-- Electronics (cat_id: 1)
('iPhone 13 Pro', 1, 999.99),
('Samsung Galaxy S21', 1, 899.99),
('MacBook Pro 16"', 1, 1999.99),
('Dell XPS 15 Laptop', 1, 1799.99),
('iPad Air', 1, 599.99),
('AirPods Pro', 1, 249.99),
('Sony 65" 4K TV', 1, 1299.99),
('Canon EOS R6 Camera', 1, 2499.99),
('PlayStation 5', 1, 499.99),
('Nintendo Switch', 1, 299.99),

-- Furniture (cat_id: 2)
('IKEA MALM Bed Frame', 2, 299.99),
('Herman Miller Aeron Chair', 2, 1099.99),
('L-Shaped Office Desk', 2, 399.99),
('Leather Recliner Sofa', 2, 899.99),
('Glass Dining Table Set', 2, 699.99),
('Wardrobe Cabinet', 2, 449.99),
('Bookshelf with Drawers', 2, 199.99),
('Ottoman Storage Bench', 2, 149.99),
('TV Entertainment Center', 2, 399.99),
('Corner Computer Desk', 2, 249.99),

-- Clothing (cat_id: 3)
('Nike Air Max Sneakers', 3, 129.99),
('Adidas Running Shoes', 3, 99.99),
('Leather Winter Jacket', 3, 199.99),
('Denim Jeans', 3, 59.99),
('Cotton T-Shirt Pack', 3, 29.99),
('Wool Sweater', 3, 79.99),
('Rain Coat', 3, 89.99),
('Business Suit', 3, 299.99),
('Summer Dress', 3, 49.99),
('Athletic Shorts', 3, 34.99),

-- Books (cat_id: 4)
('The Great Gatsby', 4, 14.99),
('To Kill a Mockingbird', 4, 15.99),
('1984 by George Orwell', 4, 12.99),
('Harry Potter Series Box Set', 4, 99.99),
('The Lord of the Rings Trilogy', 4, 49.99),
('Python Programming Guide', 4, 39.99),
('Cooking Basics Cookbook', 4, 29.99),
('World History Encyclopedia', 4, 79.99),
('Medical Dictionary', 4, 59.99),
('Business Management Guide', 4, 44.99),

-- Sports Equipment (cat_id: 5)
('Tennis Racket Pro', 5, 159.99),
('Basketball Official Size', 5, 29.99),
('Yoga Mat Premium', 5, 39.99),
('Dumbbells Set 20kg', 5, 149.99),
('Treadmill T-2000', 5, 999.99),
('Soccer Ball', 5, 24.99),
('Golf Club Set', 5, 499.99),
('Boxing Gloves', 5, 49.99),
('Bicycle Mountain Pro', 5, 799.99),
('Swimming Goggles', 5, 19.99),

-- Food & Beverages (cat_id: 6)
('Organic Coffee Beans 1kg', 6, 24.99),
('Green Tea Pack 100pc', 6, 19.99),
('Chocolate Gift Box', 6, 34.99),
('Protein Powder 2kg', 6, 59.99),
('Mixed Nuts 500g', 6, 14.99),
('Olive Oil Extra Virgin', 6, 19.99),
('Red Wine Premium', 6, 49.99),
('Honey Organic 1kg', 6, 15.99),
('Pasta Selection Pack', 6, 29.99),
('Energy Drink Pack', 6, 19.99),

-- Health & Beauty (cat_id: 7)
('Face Moisturizer', 7, 29.99),
('Shampoo & Conditioner Set', 7, 24.99),
('Multivitamin Pack', 7, 19.99),
('Electric Toothbrush', 7, 89.99),
('Perfume Luxury', 7, 79.99),
('Face Mask Pack', 7, 14.99),
('Hair Dryer Professional', 7, 99.99),
('Makeup Kit Complete', 7, 149.99),
('Sunscreen SPF 50', 7, 19.99),
('Anti-Aging Cream', 7, 49.99),

-- Home & Garden (cat_id: 8)
('Garden Tool Set', 8, 79.99),
('Plant Pots Set of 3', 8, 34.99),
('Lawn Mower Electric', 8, 299.99),
('Outdoor Furniture Set', 8, 899.99),
('BBQ Grill Premium', 8, 499.99),
('Indoor Plants Pack', 8, 49.99),
('Garden Hose 50ft', 8, 29.99),
('Pruning Shears Pro', 8, 24.99),
('Artificial Grass 10m²', 8, 199.99),
('Solar Garden Lights', 8, 39.99),

-- Toys & Games (cat_id: 9)
('LEGO Star Wars Set', 9, 89.99),
('Barbie Dreamhouse', 9, 199.99),
('Remote Control Car', 9, 49.99),
('Board Game Collection', 9, 79.99),
('Educational Toy Set', 9, 39.99),
('Stuffed Animal Pack', 9, 29.99),
('Building Blocks 100pc', 9, 34.99),
('Art Set for Kids', 9, 24.99),
('Puzzle 1000 Pieces', 9, 19.99),
('Drone with Camera', 9, 299.99);

-- Insert Shops (200 shops)
INSERT INTO shop (name, usr_id)
SELECT 
    'Shop ' || generate_series(1, 200),
    floor(random() * 100) + 1;

-- Insert Product_In (1000 inventory movements)
-- Only insert movements for products that exist (1-90)
INSERT INTO product_in (shop_id, ven_id, prod_id, type, quantity, price, created_at)
SELECT 
    floor(random() * 200) + 1 AS shop_id,          -- Shops range: 1-200
    floor(random() * 48) + 1 AS ven_id,            -- Vendors range: 1-48
    floor(random() * 90) + 1 AS prod_id,           -- Products range: 1-90 (only existing products)
    CASE floor(random() * 2)
        WHEN 0 THEN 'IN'
        WHEN 1 THEN 'OUT'
    END AS type,
    floor(random() * 100) + 1 AS quantity,
    CASE 
        WHEN floor(random() * 2) = 0 THEN 
            (random() * 100 + 10)::numeric(10,2)    -- Regular priced items ($10-$110)
        ELSE 
            (random() * 1000 + 100)::numeric(10,2)  -- Premium items ($100-$1100)
    END AS price,
    NOW() - (random() * interval '365 days') AS created_at
FROM generate_series(1, 1000);

-- Add some realistic prices for specific products
UPDATE product_in 
SET price = CASE 
    WHEN prod_id = 1 THEN 999.99  -- iPhone 13 Pro
    WHEN prod_id = 2 THEN 899.99  -- Samsung Galaxy S21
    WHEN prod_id = 3 THEN 1999.99 -- MacBook Pro 16"
    WHEN prod_id = 4 THEN 1599.99 -- Dell XPS 15
    WHEN prod_id = 5 THEN 599.99  -- iPad Air
    WHEN prod_id = 6 THEN 249.99  -- AirPods Pro
    WHEN prod_id = 7 THEN 1299.99 -- Sony 65" 4K TV
    WHEN prod_id = 8 THEN 2499.99 -- Canon EOS R6
    WHEN prod_id = 9 THEN 499.99  -- PlayStation 5
    WHEN prod_id = 10 THEN 299.99 -- Nintendo Switch
    ELSE price
END
WHERE prod_id <= 10;

-- Add some more realistic product names
UPDATE product
SET name = name_list.name
FROM (
    SELECT id, name
    FROM (VALUES
        (1, 'Laptop'),
        (2, 'Smartphone'),
        (3, 'Tablet'),
        (4, 'Desktop Computer'),
        (5, 'Printer'),
        (6, 'Monitor'),
        (7, 'Keyboard'),
        (8, 'Mouse'),
        (9, 'Headphones'),
        (10, 'Speaker')
        -- Add more as needed
    ) AS names(id, name)
) AS name_list
WHERE product.id <= 10;

-- Add some more realistic vendor names
UPDATE vendors
SET name = ven_list.name
FROM (
    SELECT id, name
    FROM (VALUES
        (1, 'Apple Inc.'),
        (2, 'Samsung Electronics'),
        (3, 'Sony Corporation'),
        (4, 'Dell Technologies'),
        (5, 'HP Inc.'),
        (6, 'LG Electronics'),
        (7, 'Lenovo Group'),
        (8, 'ASUS'),
        (9, 'Acer Inc.'),
        (10, 'Microsoft')
        -- Add more as needed
    ) AS names(id, name)
) AS ven_list
WHERE vendors.id <= 10; 