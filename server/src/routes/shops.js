import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Get all shops with pagination, sorting, and search
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
        { user: { name: { contains: search, mode: 'insensitive' } } }
      ]
    } : {};

    // Build the orderBy clause
    const orderByClause = {};
    switch (sortBy) {
      case 'name':
        orderByClause.name = sortOrder;
        break;
      case 'user':
        orderByClause.user = { name: sortOrder };
        break;
      default:
        orderByClause.id = sortOrder;
    }

    // Get total count for pagination
    const total = await prisma.shop.count({
      where: whereClause
    });

    // Get paginated and sorted data
    const shops = await prisma.shop.findMany({
      where: whereClause,
      include: {
        user: {
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
      data: shops,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in GET /shops:', error);
    res.status(500).json({ message: error.message });
  }
});

// Other routes remain the same...
// ... existing code ... 