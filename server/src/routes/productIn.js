import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Get all inventory movements with pagination, sorting, and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'id';
    const sortOrder = req.query.sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    const userId = parseInt(req.query.userId);
    const shopId = parseInt(req.query.shopId);
    const skip = (page - 1) * limit;

    // Validate required parameters
    if (!userId) {
      return res.status(400).json({
        error: 'User ID is required',
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      });
    }

    // Build the where clause for search and filtering
    let whereClause = {};

    // If shopId is provided, filter by specific shop
    if (shopId) {
      whereClause.shop_id = shopId;
    }
    // If userId is provided, filter by user's shops
    else if (userId) {
      const userShops = await prisma.shop.findMany({
        where: { usr_id: userId },
        select: { id: true }
      });

      if (!userShops || userShops.length === 0) {
        return res.status(403).json({
          error: 'No shops assigned to this user',
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
          }
        });
      }

      whereClause.shop_id = {
        in: userShops.map(shop => shop.id)
      };
    }

    // Add search condition if search term is provided
    if (search) {
      whereClause.OR = [
        {
          product: {
            name: { contains: search, mode: 'insensitive' }
          }
        },
        {
          shop: {
            name: { contains: search, mode: 'insensitive' }
          }
        },
        {
          vendor: {
            name: { contains: search, mode: 'insensitive' }
          }
        }
      ];
    }

    // Get total count for pagination
    const total = await prisma.productIn.count({
      where: whereClause
    });

    // Build the orderBy clause
    const orderByClause = {};
    switch (sortBy) {
      case 'product':
        orderByClause.product = { name: sortOrder };
        break;
      case 'shop':
        orderByClause.shop = { name: sortOrder };
        break;
      case 'vendor':
        orderByClause.vendor = { name: sortOrder };
        break;
      case 'type':
        orderByClause.type = sortOrder;
        break;
      case 'quantity':
        orderByClause.quantity = sortOrder;
        break;
      case 'price':
        orderByClause.price = sortOrder;
        break;
      default:
        orderByClause.id = sortOrder;
    }

    // Get paginated and sorted data
    const inventory = await prisma.productIn.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip,
      take: limit,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            cat_id: true
          }
        },
        shop: {
          select: {
            id: true,
            name: true
          }
        },
        vendor: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Transform the data to include names directly
    const transformedInventory = inventory.map(item => ({
      ...item,
      productName: item.product.name,
      shopName: item.shop.name,
      vendorName: item.vendor.name,
      price: Number(item.price)
    }));

    res.json({
      data: transformedInventory,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in GET /inventory:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    });
  }
});

// Get single inventory movement
router.get('/:id', async (req, res) => {
  try {
    const productIn = await prisma.productIn.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            cat_id: true
          }
        },
        shop: {
          select: {
            id: true,
            name: true
          }
        },
        vendor: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    if (!productIn) {
      return res.status(404).json({ message: 'Inventory movement not found' });
    }
    
    // Transform the response
    const transformedProductIn = {
      ...productIn,
      productName: productIn.product.name,
      shopName: productIn.shop.name,
      vendorName: productIn.vendor.name
    };

    res.json(transformedProductIn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create inventory movement
router.post('/', async (req, res) => {
  try {
    // Validate and parse input values
    const shopId = parseInt(req.body.shopId);
    const vendorId = parseInt(req.body.vendorId);
    const productId = parseInt(req.body.productId);
    const quantity = parseInt(req.body.quantity);
    const price = parseFloat(req.body.price);

    // Validate required fields
    if (!shopId || !vendorId || !productId || !quantity || isNaN(price)) {
      return res.status(400).json({
        error: 'All fields are required and must be valid numbers',
        data: null
      });
    }

    const productIn = await prisma.productIn.create({
      data: {
        shop_id: shopId,
        ven_id: vendorId,
        prod_id: productId,
        type: req.body.type,
        quantity: quantity,
        price: price
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            cat_id: true
          }
        },
        shop: {
          select: {
            id: true,
            name: true
          }
        },
        vendor: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Transform the response
    const transformedProductIn = {
      ...productIn,
      productName: productIn.product.name,
      shopName: productIn.shop.name,
      vendorName: productIn.vendor.name,
      price: Number(productIn.price) // Ensure price is a number
    };

    res.status(201).json(transformedProductIn);
  } catch (error) {
    console.error('Error creating inventory:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to create inventory movement',
      data: null
    });
  }
});

// Update inventory movement
router.put('/:id', async (req, res) => {
  try {
    const productIn = await prisma.productIn.update({
      where: { id: parseInt(req.params.id) },
      data: {
        shop_id: parseInt(req.body.shopId),
        ven_id: parseInt(req.body.vendorId),
        prod_id: parseInt(req.body.productId),
        type: req.body.type,
        quantity: parseInt(req.body.quantity),
        price: parseFloat(req.body.price)
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            cat_id: true
          }
        },
        shop: {
          select: {
            id: true,
            name: true
          }
        },
        vendor: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Transform the response
    const transformedProductIn = {
      ...productIn,
      productName: productIn.product.name,
      shopName: productIn.shop.name,
      vendorName: productIn.vendor.name
    };

    res.json(transformedProductIn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete inventory movement
router.delete('/:id', async (req, res) => {
  try {
    await prisma.productIn.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 