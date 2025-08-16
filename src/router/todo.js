const express = require('express');
const router = express.Router();
const {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
  todos
} = require('../helpers/todoHelpers');

// GET /api/todos - Get all todos
router.get('/', (req, res) => {
  try {
    const { completed, search } = req.query;
    const filters = { completed, search };
    
    const todos = getAllTodos(filters);
    
    res.json({
      success: true,
      data: todos,
      count: todos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/todos/:id - Get a specific todo
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const todo = getTodoById(id);
    
    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/todos - Create a new todo
router.post('/', (req, res) => {
  try {
    const newTodo = createTodo(req.body);
    
    res.status(201).json({
      success: true,
      data: newTodo,
      message: 'Todo created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/todos/:id - Update a todo
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, completed } = req.body;
    
    const updates = {
      title: title !== undefined ? title.trim() : undefined,
      description: description !== undefined ? description.trim() : undefined,
      completed: completed !== undefined ? completed : undefined
    };
    
    const updatedTodo = updateTodo(id, updates);
    
    res.json({
      success: true,
      data: updatedTodo,
      message: 'Todo updated successfully'
    });
  } catch (error) {
    const statusCode = error.message === 'Todo not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// PATCH /api/todos/:id - Partially update a todo
router.patch('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    const updatedTodo = updateTodo(id, updates);
    
    res.json({
      success: true,
      data: updatedTodo,
      message: 'Todo updated successfully'
    });
  } catch (error) {
    const statusCode = error.message === 'Todo not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedTodo = deleteTodo(id);
    
    res.json({
      success: true,
      data: deletedTodo,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/todos - Delete all todos
router.delete('/', (req, res) => {
  try {
    const deletedCount = deleteAllTodos();
    
    res.json({
      success: true,
      message: `All ${deletedCount} todos deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
