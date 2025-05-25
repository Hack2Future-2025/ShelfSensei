import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Get all vendors with pagination, sorting, and search
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
    const total = await prisma.vendor.count({
      where: whereClause
    });

    // Get paginated and sorted data
    const vendors = await prisma.vendor.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip,
      take: limit
    });

    res.json({
      data: vendors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error in GET /vendors:', error);
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

// Create new vendor
router.post('/', async (req, res) => {
  try {
    const vendor = await prisma.vendor.create({
      data: {
        name: req.body.name
      }
    });
    res.status(201).json(vendor);
  } catch (error) {
    console.error('Error creating vendor:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get single vendor
router.get('/:id', async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update vendor
router.put('/:id', async (req, res) => {
  try {
    const vendor = await prisma.vendor.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name
      }
    });
    res.json(vendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete vendor
router.delete('/:id', async (req, res) => {
  try {
    await prisma.vendor.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 