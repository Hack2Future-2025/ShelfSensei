import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Get all dashboard data in one request
router.get('/', async (req, res) => {
  try {
    const { userId, shopId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Build shop filter
    const shopFilter = {};
    if (shopId) {
      shopFilter.shop_id = parseInt(shopId);
    } else {
      const userShops = await prisma.shop.findMany({
        where: { usr_id: parseInt(userId) },
        select: { id: true }
      });
      
      if (!userShops || userShops.length === 0) {
        return res.status(403).json({ message: 'No shops assigned to this user' });
      }
      
      shopFilter.shop_id = {
        in: userShops.map(shop => shop.id)
      };
    }

    // Get all required data in parallel
    const [
      totalProducts,
      totalCategories,
      totalVendors,
      inventoryValue,
      productsByCategory,
      monthlyMovements,
      inventoryByShop,
      recentMovements
    ] = await Promise.all([
      // Total Products
      prisma.product.count({
        where: {
          productIns: {
            some: shopFilter
          }
        }
      }),

      // Total Categories
      prisma.category.count(),

      // Total Vendors
      prisma.vendor.count(),

      // Total Inventory Value
      prisma.productIn.aggregate({
        _sum: {
          price: true
        },
        where: {
          ...shopFilter,
          type: 'IN'
        }
      }),

      // Products by Category
      prisma.category.findMany({
        select: {
          name: true,
          _count: {
            select: {
              products: {
                where: {
                  productIns: {
                    some: shopFilter
                  }
                }
              }
            }
          }
        }
      }),

      // Monthly Movements
      prisma.productIn.findMany({
        where: shopFilter,
        select: {
          type: true,
          quantity: true,
          id: true
        },
        orderBy: {
          id: 'asc'
        }
      }),

      // Inventory by Shop
      prisma.shop.findMany({
        where: shopId ? { id: parseInt(shopId) } : { usr_id: parseInt(userId) },
        select: {
          name: true,
          productIns: {
            select: {
              quantity: true,
              type: true
            }
          }
        }
      }),

      // Recent Movements
      prisma.productIn.findMany({
        where: shopFilter,
        select: {
          id: true,
          type: true,
          quantity: true,
          createdAt: true,
          product: {
            select: {
              name: true
            }
          },
          shop: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })
    ]);

    // Format the data
    const formattedProductsByCategory = productsByCategory.reduce((acc, cat) => {
      acc[cat.name] = cat._count.products;
      return acc;
    }, {});

    // Group movements by month
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    const formattedMonthlyMovements = monthlyMovements.reduce((acc, movement) => {
      const key = `${currentMonth} ${currentYear}`;
      
      if (!acc[key]) {
        acc[key] = { in: 0, out: 0 };
      }
      acc[key][movement.type.toLowerCase()] += movement.quantity;
      return acc;
    }, {});

    // Since we're only showing current month now, no need to sort
    const sortedMonthlyMovements = formattedMonthlyMovements;

    // Format inventory by shop
    const formattedInventoryByShop = inventoryByShop.reduce((acc, shop) => {
      const totalQuantity = shop.productIns.reduce((sum, movement) => {
        return sum + (movement.type === 'IN' ? movement.quantity : -movement.quantity);
      }, 0);
      acc[shop.name] = totalQuantity;
      return acc;
    }, {});

    // Format recent movements
    const formattedRecentMovements = recentMovements.map(movement => ({
      id: movement.id,
      productName: movement.product.name,
      shopName: movement.shop.name,
      type: movement.type,
      quantity: movement.quantity,
      createdAt: movement.createdAt
    }));

    res.json({
      totalProducts,
      totalCategories,
      totalVendors,
      inventoryValue: Number(inventoryValue._sum.price || 0),
      productsByCategory: formattedProductsByCategory,
      monthlyMovements: sortedMonthlyMovements,
      inventoryByShop: formattedInventoryByShop,
      recentMovements: formattedRecentMovements
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total inventory value
    const inventoryValue = await prisma.productIn.aggregate({
      _sum: {
        price: true
      },
      where: {
        type: 'IN'
      }
    });

    // Get product counts by category
    const productsByCategory = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    // Get low stock alerts (products with quantity less than 10)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        productIns: {
          some: {
            quantity: {
              lt: 10
            }
          }
        }
      },
      include: {
        category: true,
        productIns: {
          where: {
            quantity: {
              lt: 10
            }
          }
        }
      }
    });

    // Get total number of products
    const totalProducts = await prisma.product.count();

    // Get total number of vendors
    const totalVendors = await prisma.vendor.count();

    // Ensure totalInventoryValue is always a number
    const totalInventoryValue = Number(inventoryValue._sum.price || 0);

    res.json({
      totalInventoryValue,
      productsByCategory,
      lowStockProducts,
      totalProducts,
      totalVendors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get inventory movement history
router.get('/inventory-history', async (req, res) => {
  try {
    const history = await prisma.productIn.findMany({
      include: {
        product: true,
        shop: true,
        vendor: true
      },
      orderBy: {
        id: 'desc'
      },
      take: 50
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products count by category
router.get('/products-by-category', async (req, res) => {
  try {
    const data = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: { products: true }
        }
      }
    });

    const formattedData = data.map(item => ({
      category_name: item.name,
      count: item._count.products
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get inventory levels by category
router.get('/inventory-by-category', async (req, res) => {
  try {
    const data = await prisma.category.findMany({
      select: {
        name: true,
        products: {
          select: {
            productIns: {
              select: {
                quantity: true,
                type: true
              }
            }
          }
        }
      }
    });

    const formattedData = data.map(category => {
      const totalQuantity = category.products.reduce((sum, product) => {
        const productQuantity = product.productIns.reduce((pSum, movement) => {
          return pSum + (movement.type === 'IN' ? movement.quantity : -movement.quantity);
        }, 0);
        return sum + productQuantity;
      }, 0);

      return {
        category_name: category.name,
        total_quantity: totalQuantity
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching inventory by category:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get product price range distribution
router.get('/price-ranges', async (req, res) => {
  try {
    const ranges = [
      { min: 0, max: 50 },
      { min: 50, max: 100 },
      { min: 100, max: 500 },
      { min: 500, max: 1000 },
      { min: 1000, max: Number.MAX_SAFE_INTEGER }
    ];

    const productPrices = await prisma.productIn.groupBy({
      by: ['prod_id'],
      _avg: {
        price: true
      }
    });

    const priceDistribution = ranges.map(range => ({
      min_price: range.min,
      max_price: range.max === Number.MAX_SAFE_INTEGER ? '1000+' : range.max,
      count: productPrices.filter(p => 
        p._avg.price >= range.min && 
        p._avg.price < range.max
      ).length
    }));

    res.json(priceDistribution);
  } catch (error) {
    console.error('Error fetching price ranges:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get top products by sales volume
router.get('/top-products', async (req, res) => {
  try {
    const data = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        productIns: {
          where: {
            type: 'OUT'
          },
          select: {
            quantity: true
          }
        }
      }
    });

    const formattedData = data
      .map(product => ({
        name: product.name,
        total_quantity: product.productIns.reduce((sum, movement) => sum + movement.quantity, 0)
      }))
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, 10);

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 