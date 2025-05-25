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
      orderBy: orderByClause,
      skip,
      take: limit,
      include: {
        category: true
      }
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
    res.status(500).json({ 
      error: error.message,
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

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        category: true
      }
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        cat_id: req.body.cat_id ? parseInt(req.body.cat_id) : null,
        price: req.body.price ? parseFloat(req.body.price) : 0
      },
      include: {
        category: true
      }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name,
        cat_id: req.body.cat_id ? parseInt(req.body.cat_id) : null,
        price: req.body.price ? parseFloat(req.body.price) : 0
      },
      include: {
        category: true
      }
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 