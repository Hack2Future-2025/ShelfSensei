import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Get all categories with pagination, sorting, and search
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
      name: { contains: search, mode: 'insensitive' }
    } : {};

    // Build the orderBy clause
    const orderByClause = {};
    switch (sortBy) {
      case 'name':
        orderByClause.name = sortOrder;
        break;
      default:
        orderByClause.id = sortOrder;
    }

    // Get total count for pagination
    const total = await prisma.category.count({
      where: whereClause
    });

    // Get paginated and sorted data
    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip,
      take: limit,
      include: {
        products: true
      }
    });

    res.json({
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in GET /categories:', error);
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

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        products: true
      }
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create category
router.post('/', async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: {
        name: req.body.name
      }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name
      }
    });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    await prisma.category.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 