const logger = require('./logger');

function validateTodoData(data, isUpdate = false) {
  const errors = [];
  
  // Title validation
  if (!isUpdate || data.title !== undefined) {
    if (!data.title || data.title.trim() === '') {
      errors.push('Title is required');
    } else if (data.title.length > 100) {
      errors.push('Title must be less than 100 characters');
    }
  }
  
  // Description validation
  if (data.description !== undefined && data.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  
  // Priority validation
  if (data.priority !== undefined && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Priority must be low, medium, or high');
  }
  
  // Due date validation
  if (data.dueDate !== undefined) {
    if (data.dueDate && isNaN(Date.parse(data.dueDate))) {
      errors.push('Due date must be a valid date');
    } else if (data.dueDate && new Date(data.dueDate) < new Date()) {
      errors.push('Due date cannot be in the past');
    }
  }
  
  // Tags validation
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push('Tags must be an array');
    } else if (data.tags.length > 10) {
      errors.push('Maximum 10 tags allowed');
    } else {
      for (const tag of data.tags) {
        if (typeof tag !== 'string' || tag.length > 20) {
          errors.push('Each tag must be a string with maximum 20 characters');
          break;
        }
      }
    }
  }
  
  // User ID validation
  if (data.userId !== undefined && data.userId && typeof data.userId !== 'string') {
    errors.push('User ID must be a string');
  }
  
  logger.debug('Validation result', { data, errors, isUpdate });
  
  return errors;
}

function sanitizeTodoData(data) {
  const sanitized = { ...data };
  
  // Sanitize title
  if (sanitized.title) {
    sanitized.title = sanitized.title.trim();
  }
  
  // Sanitize description
  if (sanitized.description) {
    sanitized.description = sanitized.description.trim();
  }
  
  // Sanitize tags
  if (sanitized.tags && Array.isArray(sanitized.tags)) {
    sanitized.tags = sanitized.tags
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, 10); // Limit to 10 tags
  }
  
  // Sanitize priority
  if (sanitized.priority) {
    sanitized.priority = sanitized.priority.toLowerCase();
  }
  
  // Sanitize due date
  if (sanitized.dueDate) {
    const date = new Date(sanitized.dueDate);
    if (!isNaN(date.getTime())) {
      sanitized.dueDate = date.toISOString();
    }
  }
  
  logger.debug('Sanitization result', { original: data, sanitized });
  
  return sanitized;
}

function validateFilters(filters) {
  const errors = [];
  
  // Completed filter validation
  if (filters.completed !== undefined && !['true', 'false'].includes(filters.completed)) {
    errors.push('Completed filter must be "true" or "false"');
  }
  
  // Priority filter validation
  if (filters.priority && !['low', 'medium', 'high'].includes(filters.priority)) {
    errors.push('Priority filter must be low, medium, or high');
  }
  
  // Search filter validation
  if (filters.search && typeof filters.search !== 'string') {
    errors.push('Search filter must be a string');
  }
  
  // User ID filter validation
  if (filters.userId && typeof filters.userId !== 'string') {
    errors.push('User ID filter must be a string');
  }
  
  return errors;
}

function validateId(id) {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  // Basic UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

module.exports = {
  validateTodoData,
  sanitizeTodoData,
  validateFilters,
  validateId
};
