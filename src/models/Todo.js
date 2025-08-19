const { v4: uuidv4 } = require('uuid');

class Todo {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.title = data.title || '';
    this.description = data.description || '';
    this.completed = data.completed || false;
    this.priority = data.priority || 'medium';
    this.dueDate = data.dueDate || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.userId = data.userId || null;
    this.tags = data.tags || [];
  }

  validate() {
    const errors = [];
    
    if (!this.title || this.title.trim() === '') {
      errors.push('Title is required');
    }
    
    if (this.title && this.title.length > 100) {
      errors.push('Title must be less than 100 characters');
    }
    
    if (this.description && this.description.length > 500) {
      errors.push('Description must be less than 500 characters');
    }
    
    if (this.priority && !['low', 'medium', 'high'].includes(this.priority)) {
      errors.push('Priority must be low, medium, or high');
    }
    
    if (this.dueDate && new Date(this.dueDate) < new Date()) {
      errors.push('Due date cannot be in the past');
    }
    
    return errors;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      priority: this.priority,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this.userId,
      tags: this.tags
    };
  }

  update(data) {
    Object.assign(this, data);
    this.updatedAt = new Date().toISOString();
    return this;
  }

  markComplete() {
    this.completed = true;
    this.updatedAt = new Date().toISOString();
    return this;
  }

  markIncomplete() {
    this.completed = false;
    this.updatedAt = new Date().toISOString();
    return this;
  }
}

module.exports = Todo;
