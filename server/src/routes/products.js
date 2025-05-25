import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Get all products with pagination, sorting, and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'id';
    const sortOrder = req.query.sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    const skip = (page - 1) * limit;

    // Build the where clause for search
    const whereClause = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } }
      ]
    } : {};

    // Build the orderBy clause
    const orderByClause = {};
    switch (sortBy) {
      case 'name':
        orderByClause.name = sortOrder;
        break;
      case 'category':
        orderByClause.category = { name: sortOrder };
        break;
      case 'price':
        orderByClause.price = sortOrder;
        break;
      default:
        orderByClause.id = sortOrder;
    }

    // Get total count for pagination
    const total = await prisma.product.count({
      where: whereClause
    });

    // Get paginated and sorted data
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: orderByClause,
      skip,
      take: limit
    });

    res.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in GET /products:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, cat_id, price } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        cat_id,
        price: price ? parseFloat(price) : 0
      },
      include: {
        category: true
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router; 