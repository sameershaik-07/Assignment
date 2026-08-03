const prisma = require('../db');
const { z } = require('zod');

const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

const updateItemSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
});

const getItems = async (req, res, next) => {
  try {
    const items = await prisma.item.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            email: true,
            platformId: true,
          },
        },
      },
    });

    return res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const item = await prisma.item.create({
      data: {
        title,
        description,
        ownerId: req.user.id,
      },
      include: {
        owner: {
          select: {
            email: true,
            platformId: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: 'Item created successfully',
      item,
    });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Check item existence and ownership
    const existing = await prisma.item.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (existing.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to modify this item' });
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
      },
      include: {
        owner: {
          select: {
            email: true,
            platformId: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: 'Item updated successfully',
      item: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.item.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (existing.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    await prisma.item.delete({
      where: { id },
    });

    return res.status(200).json({
      message: 'Item deleted successfully',
      id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  createItemSchema,
  updateItemSchema,
};
