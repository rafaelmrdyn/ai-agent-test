# Express Todo REST API

A simple Express.js starter with a complete todo REST API implementation.

## Features

- ✅ Full CRUD operations for todos
- 🔍 Search and filter functionality
- 🛡️ Security middleware (Helmet, CORS)
- 📝 Request logging (Morgan)
- 🏗️ Modular router structure with helper functions
- 🚀 Development mode with hot reload
- 🔧 Separation of concerns (routes vs business logic)

## Project Structure

```
├── src/
│   ├── app.js              # Main Express application
│   ├── helpers/
│   │   └── todoHelpers.js  # Todo business logic and helper functions
│   └── router/
│       └── todo.js         # Todo routes
├── package.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Or start in production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Todos

#### Get All Todos
- `GET /api/todos`
- Query parameters:
  - `completed=true|false` - Filter by completion status
  - `search=string` - Search in title and description

#### Get Single Todo
- `GET /api/todos/:id`

#### Create Todo
- `POST /api/todos`
- Body:
```json
{
  "title": "Todo title",
  "description": "Optional description"
}
```

#### Update Todo (Full)
- `PUT /api/todos/:id`
- Body:
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

#### Update Todo (Partial)
- `PATCH /api/todos/:id`
- Body (any combination):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

#### Delete Todo
- `DELETE /api/todos/:id`

#### Delete All Todos
- `DELETE /api/todos`

## Example Usage

### Get all todos
```bash
curl http://localhost:3000/api/todos
```

### Create a new todo
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, bread, eggs"}'
```

### Update a todo
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, bread, eggs", "completed": true}'
```

### Mark todo as completed
```bash
curl -X PATCH http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete a todo
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {...},
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **morgan** - HTTP request logger
- **nodemon** - Development server with auto-reload

## Development

The project uses nodemon for development, which automatically restarts the server when files change.

## Next Steps

To enhance this starter:

1. Add database integration (MongoDB, PostgreSQL, etc.)
2. Implement user authentication
3. Add input validation middleware
4. Add unit tests
5. Add API documentation with Swagger
6. Implement rate limiting
7. Add environment configuration
