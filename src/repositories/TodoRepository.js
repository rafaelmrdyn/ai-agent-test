const { query } = require('../config/database');
const Todo = require('../models/Todo');
const logger = require('../utils/logger');

class TodoRepository {
  constructor() {
    this.todos = new Map();
    this.initializeSampleData();
  }

  initializeSampleData() {
    const sampleTodos = [
      {
        title: 'Learn Express.js',
        description: 'Build a REST API with Express',
        completed: false,
        priority: 'high',
        tags: ['learning', 'express']
      },
      {
        title: 'Create Todo App',
        description: 'Build a simple todo application',
        completed: true,
        priority: 'medium',
        tags: ['project', 'todo']
      }
    ];

    sampleTodos.forEach(todoData => {
      const todo = new Todo(todoData);
      this.todos.set(todo.id, todo);
    });
  }

  async findAll(filters = {}) {
    try {
      let todos = Array.from(this.todos.values());
      
      // Apply filters
      if (!filters.completed) {
        const isCompleted = filters.completed === 'true';
        todos = todos.filter(todo => todo.completed === isCompleted);
      }
      
      if (filters.priority) {
        todos = todos.filter(todo => todo.priority === filters.priority);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        todos = todos.filter(todo => 
          todo.title.toLowerCase().includes(searchLower) ||
          todo.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.userId) {
        todos = todos.filter(todo => todo.userId === filters.userId);
      }
      
      // Simulate database query
      await query('SELECT * FROM todos WHERE 1=1', []);
      
      logger.info(`Found ${todos.length} todos`);
      return todos;
    } catch (error) {
      logger.error('Error finding todos:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const todo = this.todos.get(id);
      if (!todo) {
        throw new Error('Todo not found');
      }
      
      // Simulate database query
      await query('SELECT * FROM todos WHERE id = ?', [id]);
      
      logger.info(`Found todo with id: ${id}`);
      return todo;
    } catch (error) {
      logger.error(`Error finding todo with id ${id}:`, error);
      throw error;
    }
  }

  async create(todoData) {
    try {
      const todo = new Todo(todoData);
      const errors = todo.validate();
      
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }
      
      this.todos.set(todo.id, todo);
      
      // Simulate database insert
      await query('INSERT INTO todos (id, title, description, completed, priority, dueDate, userId, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [todo.id, todo.title, todo.description, todo.completed, todo.priority, todo.dueDate, todo.userId, JSON.stringify(todo.tags)]);
      
      logger.info(`Created todo with id: ${todo.id}`);
      return todo;
    } catch (error) {
      logger.error('Error creating todo:', error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const todo = await this.findById(id);
      const updatedTodo = todo.update(updates);
      
      const errors = updatedTodo.validate();
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }
      
      this.todos.set(id, updatedTodo);
      
      // Simulate database update
      await query('UPDATE todos SET title = ?, description = ?, completed = ?, priority = ?, dueDate = ?, updatedAt = ? WHERE id = ?',
        [updatedTodo.title, updatedTodo.description, updatedTodo.completed, updatedTodo.priority, updatedTodo.dueDate, updatedTodo.updatedAt, id]);
      
      logger.info(`Updated todo with id: ${id}`);
      return updatedTodo;
    } catch (error) {
      logger.error(`Error updating todo with id ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const todo = await this.findById(id);
      this.todos.delete(id);
      
      // Simulate database delete
      await query('DELETE FROM todos WHERE id = ?', [id]);
      
      logger.info(`Deleted todo with id: ${id}`);
      return todo;
    } catch (error) {
      logger.error(`Error deleting todo with id ${id}:`, error);
      throw error;
    }
  }

  async deleteAll() {
    try {
      const deletedCount = this.todos.size;
      this.todos.clear();
      
      // Simulate database delete all
      await query('DELETE FROM todos', []);
      
      logger.info(`Deleted all ${deletedCount} todos`);
      return deletedCount;
    } catch (error) {
      logger.error('Error deleting all todos:', error);
      throw error;
    }
  }

  async findByUserId(userId) {
    try {
      const todos = Array.from(this.todos.values()).filter(todo => todo.userId === userId);
      
      // Simulate database query
      await query('SELECT * FROM todos WHERE userId = ?', [userId]);
      
      logger.info(`Found ${todos.length} todos for user: ${userId}`);
      return todos;
    } catch (error) {
      logger.error(`Error finding todos for user ${userId}:`, error);
      throw error;
    }
  }
}

module.exports = TodoRepository;
