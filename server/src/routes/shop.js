import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

// Get all shops
router.get('/', async (req, res) => {
  try {
    const shops = await prisma.shop.findMany({
      include: {
        user: true,
        productIns: true
      }
    });
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single shop
router.get('/:id', async (req, res) => {
  try {
    const shop = await prisma.shop.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: true,
        productIns: true
      }
    });
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create shop
router.post('/', async (req, res) => {
  try {
    const shop = await prisma.shop.create({
      data: {
        name: req.body.name,
        userId: parseInt(req.body.userId)
      },
      include: {
        user: true
      }
    });
    res.status(201).json(shop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update shop
router.put('/:id', async (req, res) => {
  try {
    const shop = await prisma.shop.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name,
        userId: parseInt(req.body.userId)
      },
      include: {
        user: true
      }
    });
    res.json(shop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete shop
router.delete('/:id', async (req, res) => {
  try {
    await prisma.shop.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 