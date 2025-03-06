# bank-project

## Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/ShaharMarom/bank-project.git
cd bank-project
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Start all services using Docker Compose:
```bash
docker-compose up -d
```

4. Check services status:
```bash
docker-compose ps
```

5. View logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs mongo
docker-compose logs redis
```

### Local Development

1. Start MongoDB and Redis services:
```bash
docker-compose up -d mongo redis
```

2. Install dependencies:
```bash
npm install
```

3. Run the application:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/bank?replicaSet=bank&directConnection=true
REDIS_HOST=localhost
```

## Docker Services

- **Backend**: Node.js application
  - Port: 3000 (configurable)
  - Environment: Production-ready configuration

- **MongoDB**: Database server
  - Port: 27017
  - Configured with replica set for transactions
  - Persistent volume storage

- **Redis**: Cache server
  - Port: 6379
  - Persistent volume storage

## Available Scripts

- `npm start`: Start the application
- `npm run dev`: Start with nodemon for development
- `npm test`: Run tests
- `npm run build`: Build the application

## Docker Commands

### Basic Operations
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild services
docker-compose up -d --build

# Remove volumes (clean data)
docker-compose down -v
```

### Maintenance
```bash
# View logs
docker-compose logs -f

# Check MongoDB replica set status
docker exec -it bank-project-mongo-1 mongosh --eval "rs.status()"

# Access MongoDB shell
docker exec -it bank-project-mongo-1 mongosh

# Redis CLI
docker exec -it bank-project-redis-1 redis-cli
```

## Troubleshooting

1. **MongoDB Connection Issues**
   - Ensure replica set is initialized
   - Check if MongoDB container is healthy
   - Verify network connectivity

2. **Redis Connection Issues**
   - Check Redis container status
   - Verify network connectivity
   - Ensure correct host configuration

3. **Container Issues**
   - Check logs: `docker-compose logs`
   - Restart services: `docker-compose restart`
   - Rebuild: `docker-compose up -d --build`
