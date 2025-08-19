const TodoRepository = require('../repositories/TodoRepository');
const logger = require('../utils/logger');
const { validateTodoData, sanitizeTodoData } = require('../utils/validators');
const { generateTodoStats, calculateCompletionRate } = require('../utils/analytics');

class TodoService {
  constructor() {
    this.todoRepository = new TodoRepository();
  }

  async getAllTodos(filters = {}) {
    try {
      logger.info('Getting all todos with filters:', filters);
      
      // Apply business logic filters
      const enhancedFilters = this.applyBusinessRules(filters);
      
      const todos = await this.todoRepository.findAll(enhancedFilters);
      
      // Add computed fields
      const enhancedTodos = todos.map(todo => this.addComputedFields(todo));
      
      return {
        success: true,
        data: enhancedTodos,
        count: enhancedTodos.length,
        stats: await this.getTodoStats(enhancedTodos)
      };
    } catch (error) {
      logger.error('Error getting all todos:', error);
      throw error;
    }
  }

  async getTodoById(id) {
    try {
      logger.info(`Getting todo by id: ${id}`);
      
      const todo = await this.todoRepository.findById(id);
      const enhancedTodo = this.addComputedFields(todo);
      
      return {
        success: true,
        data: enhancedTodo
      };
    } catch (error) {
      logger.error(`Error getting todo by id ${id}:`, error);
      throw error;
    }
  }

  async createTodo(todoData) {
    try {
      logger.info('Creating new todo:', todoData);
      
      // Validate input data
      const validationErrors = validateTodoData(todoData);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Sanitize data
      const sanitizedData = sanitizeTodoData(todoData);
      
      // Apply business rules
      const enhancedData = this.applyBusinessRules(sanitizedData);
      
      const todo = await this.todoRepository.create(enhancedData);
      const enhancedTodo = this.addComputedFields(todo);
      
      logger.info(`Successfully created todo with id: ${todo.id}`);
      
      return {
        success: true,
        data: enhancedTodo,
        message: 'Todo created successfully'
      };
    } catch (error) {
      logger.error('Error creating todo:', error);
      throw error;
    }
  }

  async updateTodo(id, updates) {
    try {
      logger.info(`Updating todo ${id} with:`, updates);
      
      // Validate update data
      const validationErrors = validateTodoData(updates, true);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Sanitize update data
      const sanitizedUpdates = sanitizeTodoData(updates);
      
      // Apply business rules for updates
      const enhancedUpdates = this.applyUpdateBusinessRules(sanitizedUpdates);
      
      const updatedTodo = await this.todoRepository.update(id, enhancedUpdates);
      const enhancedTodo = this.addComputedFields(updatedTodo);
      
      logger.info(`Successfully updated todo with id: ${id}`);
      
      return {
        success: true,
        data: enhancedTodo,
        message: 'Todo updated successfully'
      };
    } catch (error) {
      logger.error(`Error updating todo ${id}:`, error);
      throw error;
    }
  }

  async deleteTodo(id) {
    try {
      logger.info(`Deleting todo with id: ${id}`);
      
      const deletedTodo = await this.todoRepository.delete(id);
      const enhancedTodo = this.addComputedFields(deletedTodo);
      
      logger.info(`Successfully deleted todo with id: ${id}`);
      
      return {
        success: true,
        data: enhancedTodo,
        message: 'Todo deleted successfully'
      };
    } catch (error) {
      logger.error(`Error deleting todo ${id}:`, error);
      throw error;
    }
  }

  async deleteAllTodos() {
    try {
      logger.info('Deleting all todos');
      
      const deletedCount = await this.todoRepository.deleteAll();
      
      logger.info(`Successfully deleted ${deletedCount} todos`);
      
      return {
        success: true,
        message: `All ${deletedCount} todos deleted successfully`
      };
    } catch (error) {
      logger.error('Error deleting all todos:', error);
      throw error;
    }
  }

  async getTodoStats(todos = null) {
    try {
      if (!todos) {
        todos = await this.todoRepository.findAll();
      }
      
      const stats = generateTodoStats(todos);
      const completionRate = calculateCompletionRate(todos);
      
      return {
        total: todos.length,
        completed: todos.filter(t => t.completed).length,
        pending: todos.filter(t => !t.completed).length,
        completionRate,
        priorityBreakdown: stats.priorityBreakdown,
        recentActivity: stats.recentActivity
      };
    } catch (error) {
      logger.error('Error getting todo stats:', error);
      throw error;
    }
  }

  async getTodosByUser(userId) {
    try {
      logger.info(`Getting todos for user: ${userId}`);
      
      const todos = await this.todoRepository.findByUserId(userId);
      const enhancedTodos = todos.map(todo => this.addComputedFields(todo));
      
      return {
        success: true,
        data: enhancedTodos,
        count: enhancedTodos.length
      };
    } catch (error) {
      logger.error(`Error getting todos for user ${userId}:`, error);
      throw error;
    }
  }

  // Private helper methods
  applyBusinessRules(data) {
    // Set default priority if not provided
    if (!data.priority) {
      data.priority = 'medium';
    }
    
    // Set default tags if not provided
    if (!data.tags) {
      data.tags = [];
    }
    
    // Set due date to end of day if provided
    if (data.dueDate) {
      const dueDate = new Date(data.dueDate);
      dueDate.setHours(23, 59, 59, 999);
      data.dueDate = dueDate.toISOString();
    }
    
    return data;
  }

  applyUpdateBusinessRules(updates) {
    // Don't allow updating certain fields directly
    delete updates.id;
    delete updates.createdAt;
    
    // Set updated timestamp
    updates.updatedAt = new Date().toISOString();
    
    return updates;
  }

  addComputedFields(todo) {
    const enhanced = { ...todo.toJSON() };
    
    // Add computed fields
    enhanced.isOverdue = this.isOverdue(todo);
    enhanced.daysUntilDue = this.getDaysUntilDue(todo);
    enhanced.priorityScore = this.getPriorityScore(todo);
    enhanced.completionStatus = this.getCompletionStatus(todo);
    
    return enhanced;
  }

  isOverdue(todo) {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  }

  getDaysUntilDue(todo) {
    if (!todo.dueDate) return null;
    const dueDate = new Date(todo.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getPriorityScore(todo) {
    const priorityScores = { low: 1, medium: 2, high: 3 };
    return priorityScores[todo.priority] || 2;
  }

  getCompletionStatus(todo) {
    if (todo.completed) return 'completed';
    if (this.isOverdue(todo)) return 'overdue';
    return 'pending';
  }
}

module.exports = TodoService;
