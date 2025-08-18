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

// Helper function to create a new todo
const createTodo = (todoData) => {
  const { title, description } = todoData;
  
  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }
  
  const newTodo = {
    id: nextId++,
    title: title.trim(),
    description: description ? description.trim() : '',
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  return newTodo;
};

// Helper function to get all todos with optional filtering
const getAllTodos = (filters = {}) => {
  const { completed, search } = filters;
  
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
  
  return filteredTodos;
};

// Helper function to get a todo by ID
const getTodoById = (id) => {
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    throw new Error('Todo not found');
  }
  return todo;
};

// Helper function to update a todo
const updateTodo = (id, updates) => {
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    throw new Error('Todo not found');
  }
  
  const updatedTodo = {
    ...todos[todoIndex],
    ...updates,
    updatedAtt: new Date().toISOString()
  };
  
  // Validate title if it's being updated
  if (updates.title !== undefined && (!updates.title || updates.title.trim() === '')) {
    throw new Error('Title is required');
  }
  
  todos[todoIndex] = updatedTodo;
  return updatedTodo;
};

// Helper function to delete a todo
const deleteTodo = (id) => {
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    throw new Error('Todo not found');
  }
  
  const deletedTodo = todos.splice(todoIndex, 1)[0];
  return deletedTodo;
};

// Helper function to delete all todos
const deleteAllTodos = () => {
  const deletedCount = todos.length;
  todos = [];
  nextId = 1;
  return deletedCount;
};

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  deleteAllTodos,
  todos // Export for direct access if needed
};
