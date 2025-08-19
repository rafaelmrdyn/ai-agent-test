const logger = require('./logger');

function generateTodoStats(todos) {
  try {
    const stats = {
      total: todos.length,
      completed: todos.filter(todo => todo.completed).length,
      pending: todos.filter(todo => !todo.completed).length,
      overdue: todos.filter(todo => {
        if (!todo.dueDate || todo.completed) return false;
        return new Date(todo.dueDate) < new Date();
      }).length,
      priorityBreakdown: {
        low: todos.filter(todo => todo.priority === 'low').length,
        medium: todos.filter(todo => todo.priority === 'medium').length,
        high: todos.filter(todo => todo.priority === 'high').length
      },
      recentActivity: getRecentActivity(todos),
      tagAnalysis: analyzeTags(todos),
      completionTrends: analyzeCompletionTrends(todos)
    };
    
    logger.debug('Generated todo stats', { stats });
    return stats;
  } catch (error) {
    logger.error('Error generating todo stats:', error);
    throw error;
  }
}

function calculateCompletionRate(todos) {
  if (todos.length === 0) return 0;
  
  const completedCount = todos.filter(todo => todo.completed).length;
  const completionRate = (completedCount / todos.length) * 100;
  
  return Math.round(completionRate * 100) / 100; // Round to 2 decimal places
}

function getRecentActivity(todos) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return todos
    .filter(todo => new Date(todo.updatedAt) >= oneWeekAgo)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 10)
    .map(todo => ({
      id: todo.id,
      title: todo.title,
      action: todo.completed ? 'completed' : 'updated',
      timestamp: todo.updatedAt
    }));
}

function analyzeTags(todos) {
  const tagCounts = {};
  
  todos.forEach(todo => {
    if (todo.tags && Array.isArray(todo.tags)) {
      todo.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function analyzeCompletionTrends(todos) {
  const trends = {
    daily: {},
    weekly: {},
    monthly: {}
  };
  
  todos.forEach(todo => {
    if (todo.completed) {
      const completedDate = new Date(todo.updatedAt);
      
      // Daily trend
      const dayKey = completedDate.toISOString().split('T')[0];
      trends.daily[dayKey] = (trends.daily[dayKey] || 0) + 1;
      
      // Weekly trend
      const weekKey = getWeekKey(completedDate);
      trends.weekly[weekKey] = (trends.weekly[weekKey] || 0) + 1;
      
      // Monthly trend
      const monthKey = completedDate.toISOString().substring(0, 7);
      trends.monthly[monthKey] = (trends.monthly[monthKey] || 0) + 1;
    }
  });
  
  return trends;
}

function getWeekKey(date) {
  const year = date.getFullYear();
  const week = Math.ceil((date.getDate() + new Date(year, date.getMonth(), 1).getDay()) / 7);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

function calculateProductivityScore(todos) {
  if (todos.length === 0) return 0;
  
  let score = 0;
  const totalWeight = todos.length;
  
  todos.forEach(todo => {
    let todoScore = 0;
    
    // Completion bonus
    if (todo.completed) {
      todoScore += 1;
      
      // Early completion bonus
      if (todo.dueDate && new Date(todo.updatedAt) < new Date(todo.dueDate)) {
        todoScore += 0.5;
      }
    }
    
    // Priority bonus
    const priorityScores = { low: 0.5, medium: 1, high: 1.5 };
    todoScore += priorityScores[todo.priority] || 1;
    
    // Overdue penalty
    if (!todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date()) {
      todoScore -= 0.5;
    }
    
    score += todoScore;
  });
  
  return Math.round((score / totalWeight) * 100) / 100;
}

function generateInsights(todos) {
  const insights = [];
  
  // Completion rate insight
  const completionRate = calculateCompletionRate(todos);
  if (completionRate < 30) {
    insights.push('Low completion rate detected. Consider breaking down tasks into smaller, more manageable pieces.');
  } else if (completionRate > 80) {
    insights.push('Excellent completion rate! You\'re doing great at staying on top of your tasks.');
  }
  
  // Overdue tasks insight
  const overdueCount = todos.filter(todo => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  }).length;
  
  if (overdueCount > 0) {
    insights.push(`${overdueCount} overdue task(s) detected. Consider reviewing and reprioritizing.`);
  }
  
  // Priority distribution insight
  const priorityBreakdown = todos.reduce((acc, todo) => {
    acc[todo.priority] = (acc[todo.priority] || 0) + 1;
    return acc;
  }, {});
  
  if (priorityBreakdown.high > todos.length * 0.5) {
    insights.push('High number of high-priority tasks. Consider if all tasks truly need high priority.');
  }
  
  // Productivity score insight
  const productivityScore = calculateProductivityScore(todos);
  if (productivityScore < 1) {
    insights.push('Productivity score is low. Focus on completing tasks and meeting deadlines.');
  }
  
  return insights;
}

module.exports = {
  generateTodoStats,
  calculateCompletionRate,
  getRecentActivity,
  analyzeTags,
  analyzeCompletionTrends,
  calculateProductivityScore,
  generateInsights
};
