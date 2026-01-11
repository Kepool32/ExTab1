# Server

Express-based REST API backend for task management.

## Installation

```bash
npm install
```

## Development

```bash
npm run start:dev
```

## Production

```bash
npm run build
npm run start:prod
```

## Docker

### Development

```bash
npm run docker:dev
```

### Production

```bash
npm run docker:prod
```

## Environment Variables

Create `.env.example` or `.env.production` file:

```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=tasks_db
```

## Technologies

- Node.js
- Express
- TypeScript
- TypeORM
- PostgreSQL
- Swagger
- Docker

## Features

- REST API endpoints
- Input validation via middleware
- Automatic database creation in PostgreSQL
- Swagger documentation
- Docker support
