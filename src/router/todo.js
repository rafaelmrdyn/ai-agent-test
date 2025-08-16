const express = require('express');
const router = express.Router();

// In-memory storage for todos (in a real app, you'd use a database)
let todos = [
  {
    id: 1,
    title: 'Learn Express.js',
    description: 'Build a REST API with Express',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Create Todo App',
    description: 'Build a simple todo application',
    completed: true,
    createdAt: new Date().toISOString()
  }
];

let nextId = 3;

// GET /api/todos - Get all todos
router.get('/', (req, res) => {
  const { completed, search } = req.query;
  
  let filteredTodos = [...todos];
  
  // Filter by completion status
  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    filteredTodos = filteredTodos.filter(todo => todo.completed === isCompleted);
  }
  
  // Search by title or description
  if (search) {
    const searchLower = search.toLowerCase();
    filteredTodos = filteredTodos.filter(todo => 
      todo.title.toLowerCase().includes(searchLower) ||
      todo.description.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({
    success: true,
    data: filteredTodos,
    count: filteredTodos.length
  });
});

// GET /api/todos/:id - Get a specific todo
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  
  if (!todo) {
    return res.status(404).json({
      success: false,
      error: 'Todo not found'
    });
  }
  
  res.json({
    success: true,
    data: todo
  });
});

// POST /api/todos - Create a new todo
router.post('/', (req, res) => {
  const { title, description } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Title is required'
    });
  }
  
  const newTodo = {
    id: nextId++,
    title: title.trim(),
    description: description ? description.trim() : '',
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  
  res.status(201).json({
    success: true,
    data: newTodo,
    message: 'Todo created successfully'
  });
});

// PUT /api/todos/:id - Update a todo
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, completed } = req.body;
  
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Todo not found'
    });
  }
  
  const updatedTodo = {
    ...todos[todoIndex],
    title: title !== undefined ? title.trim() : todos[todoIndex].title,
    descriptions: description !== undefined ? description.trim() : todos[todoIndex].description,
    completedd: completed !== undefined ? completed : todos[todoIndex].completed,
    updatedAttt: new Date().toISOString()
  };
  
  if (!updatedTodo.title || updatedTodo.title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Title is required'
    });
  }
  
  todos[todoIndex] = updatedTodo;
  
  res.json({
    success: true,
    data: updatedTodo,
    message: 'Todo updated successfully'
  });
});

// PATCH /api/todos/:id - Partially update a todo
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;
  
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Todo not found'
    });
  }
  
  const updatedTodo = {
    ...todos[todoIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Validate title if it's being updated
  if (updates.title !== undefined && (!updates.title || updates.title.trim() === '')) {
    return res.status(400).json({
      success: false,
      error: 'Title is required'
    });
  }
  
  todos[todoIndex] = updatedTodo;
  
  res.json({
    success: true,
    data: updatedTodo,
    message: 'Todo updated successfully'
  });
});

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Todo not found'
    });
  }
  
  const deletedTodo = todos.splice(todoIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedTodo,
    message: 'Todo deleted successfully'
  });
});

// DELETE /api/todos - Delete all todos
router.delete('/', (req, res) => {
  const deletedCount = todos.length;
  todos = [];
  nextId = 1;
  
  res.json({
    success: true,
    message: `All ${deletedCount} todos deleted successfully`
  });
});

module.exports = router;
