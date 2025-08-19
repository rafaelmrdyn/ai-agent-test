const express = require('express');
const router = express.Router();
const TodoService = require('../services/TodoService');
const logger = require('../utils/logger');
const { validateFilters, validateId } = require('../utils/validators');

const todoService = new TodoService();

// Middleware to log requests
router.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.logRequest(req, res, duration);
  });
  next();
});

// GET /api/todos - Get all todos with optional filtering
router.get('/', async (req, res) => {
  try {
    const filters = {
      completed: req.query.completed,
      priority: req.query.priority,
      search: req.query.search,
      userId: req.query.userId
    };

    // Validate filters
    const filterErrors = validateFilters(filters);
    if (filterErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid filters: ${filterErrors.join(', ')}`
      });
    }

    const result = await todoService.getAllTodos(filters);
    
    res.json(result);
  } catch (error) {
    logger.logError(error, { route: 'GET /api/todos', filters: req.query });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/todos/stats - Get todo statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await todoService.getTodoStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.logError(error, { route: 'GET /api/todos/stats' });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/todos/:id - Get a specific todo
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!validateId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format'
      });
    }

    const result = await todoService.getTodoById(id);
    
    res.json(result);
  } catch (error) {
    logger.logError(error, { route: 'GET /api/todos/:id', id: req.params.id });
    
    if (error.message === 'Todo not found') {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  try {
    const result = await todoService.createTodo(req.body);
    
    res.status(201).json(result);
  } catch (error) {
    logger.logError(error, { route: 'POST /api/todos', body: req.body });
    
    if (error.message.includes('Validation failed')) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

// PUT /api/todos/:id - Update a todo (full update)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!validateId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format'
      });
    }

    const result = await todoService.updateTodo(id, req.body);
    
    res.json(result);
  } catch (error) {
    logger.logError(error, { route: 'PUT /api/todos/:id', id: req.params.id, body: req.body });
    
    if (error.message === 'Todo not found') {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else if (error.message.includes('Validation failed')) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

// PATCH /api/todos/:id - Partially update a todo
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!validateId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format'
      });
    }

    const result = await todoService.updateTodo(id, req.body);
    
    res.json(result);
  } catch (error) {
    logger.logError(error, { route: 'PATCH /api/todos/:id', id: req.params.id, body: req.body });
    
    if (error.message === 'Todo not found') {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else if (error.message.includes('Validation failed')) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!validateId(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format'
      });
    }

    const result = await todoService.deleteTodo(id);
    
    res.json(result);
  } catch (error) {
    logger.logError(error, { route: 'DELETE /api/todos/:id', id: req.params.id });
    
    if (error.message === 'Todo not found') {
      res.status(404).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
});

// DELETE /api/todos - Delete all todos
router.delete('/', async (req, res) => {
  try {
    const result = await todoService.deleteAllTodos();
    
    res.json(result);
  } catch (error) {
    logger.logError(error, { route: 'DELETE /api/todos' });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/todos/user/:userId - Get todos by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    const result = await todoService.getTodosByUser(userId);
    
    res.json(result);
  } catch (error) {
    logger.logError(error, { route: 'GET /api/todos/user/:userId', userId: req.params.userId });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
