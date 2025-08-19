# Enterprise Todo API

A comprehensive, enterprise-level Todo API built with Express.js featuring a layered architecture with proper separation of concerns.

## 🏗️ Architecture

This project follows a clean, layered architecture pattern:

```
src/
├── config/          # Configuration and database setup
├── models/          # Data models and validation
├── repositories/    # Data access layer
├── services/        # Business logic layer
├── routes/          # API route handlers
├── utils/           # Utility functions and helpers
└── app.js          # Express application setup
```

### Layer Responsibilities

- **Models**: Data structure definitions and validation
- **Repositories**: Data persistence and database operations
- **Services**: Business logic and orchestration
- **Routes**: HTTP request handling and response formatting
- **Utils**: Cross-cutting concerns (logging, validation, analytics)

## 🚀 Features

- **Layered Architecture**: Clean separation of concerns
- **Comprehensive Validation**: Input validation and sanitization
- **Structured Logging**: JSON-formatted logs with different levels
- **Analytics**: Todo statistics and insights
- **Error Handling**: Global error handling with proper HTTP status codes
- **Security**: Helmet.js security headers and CORS configuration
- **Graceful Shutdown**: Proper process termination handling

## 📦 Installation

```bash
npm install
```

## 🏃‍♂️ Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## 🔗 API Endpoints

### Todo Management

- `GET /api/todos` - Get all todos with filtering
- `GET /api/todos/stats` - Get todo statistics
- `GET /api/todos/:id` - Get specific todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Full update of todo
- `PATCH /api/todos/:id` - Partial update of todo
- `DELETE /api/todos/:id` - Delete specific todo
- `DELETE /api/todos` - Delete all todos
- `GET /api/todos/user/:userId` - Get todos by user

### Health Check

- `GET /health` - Application health status

## 📊 Todo Model

```javascript
{
  id: "uuid",
  title: "string (required, max 100 chars)",
  description: "string (max 500 chars)",
  completed: "boolean (default: false)",
  priority: "low|medium|high (default: medium)",
  dueDate: "ISO date string",
  createdAt: "ISO date string",
  updatedAt: "ISO date string",
  userId: "string",
  tags: ["string array (max 10 tags, 20 chars each)"]
}
```

## 🔍 Query Parameters

### Filtering
- `completed=true|false` - Filter by completion status
- `priority=low|medium|high` - Filter by priority
- `search=string` - Search in title and description
- `userId=string` - Filter by user ID

## 📈 Analytics Features

The API provides comprehensive analytics:

- **Completion Rate**: Percentage of completed todos
- **Priority Breakdown**: Distribution across priority levels
- **Recent Activity**: Last 10 updated todos
- **Tag Analysis**: Most used tags
- **Completion Trends**: Daily, weekly, monthly trends
- **Productivity Score**: Calculated based on completion and priority
- **Insights**: AI-generated recommendations

## 🛡️ Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Comprehensive validation and sanitization
- **Error Handling**: No sensitive information leakage in production

## 📝 Logging

Structured JSON logging with different levels:

- **ERROR**: Application errors and exceptions
- **WARN**: Warning conditions
- **INFO**: General information and requests
- **DEBUG**: Detailed debugging information

## 🔧 Configuration

Environment variables:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development|production)
- `LOG_LEVEL`: Logging level (error|warn|info|debug)
- `ALLOWED_ORIGINS`: CORS allowed origins (comma-separated)

## 🏗️ Dependency Chain Example

This project demonstrates complex dependency relationships:

```
test.js (utility functions)
  ↓
todoHelpers.js (imports test.js)
  ↓
TodoRepository.js (uses todoHelpers)
  ↓
TodoService.js (uses TodoRepository)
  ↓
routes/todo.js (uses TodoService)
  ↓
API endpoints
```

## 🧪 Testing the Dependency Analysis

The GitHub Actions workflow will analyze changes and show:

1. **Changed Functions**: What functions were modified
2. **Dependency Chain**: How changes propagate through the system
3. **Affected Routes**: Which API endpoints are impacted
4. **Visual Diagram**: Mermaid diagram showing relationships

## 📚 Code Quality

- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Modular Design**: Reusable and maintainable code
- **Type Safety**: Proper validation and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
