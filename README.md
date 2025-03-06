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

3. Configure your environment variables (required):
   - Get your Twilio credentials from [Twilio Console](https://www.twilio.com/console)
   - Set up a secure JWT secret
   - Update your `.env` file with the following required values:
```env
# JWT Configuration
JWT_SECRET=your_secure_jwt_secret

# Twilio Configuration
TWILIO=your_twilio_api_key
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid

# Other Configuration
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
MONGODB_URI=mongodb://localhost:27017/bank?replicaSet=bank&directConnection=true
```

4. Start all services using Docker Compose:
```bash
docker-compose up -d
```

5. Check services status:
```bash
docker-compose ps
```

6. View logs:
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

## API Dependencies

### Twilio Integration
This project uses Twilio for phone number verification. You'll need to:
1. Create a [Twilio account](https://www.twilio.com/try-twilio)
2. Set up a Verify Service in your Twilio console
3. Get your account credentials:
   - Account SID
   - Auth Token
   - Verify Service SID
4. Add these credentials to your `.env` file

### JWT Authentication
The application uses JWT (JSON Web Tokens) for authentication:
1. Set a secure `JWT_SECRET` in your `.env` file
2. This secret is used to sign and verify authentication tokens
3. Make sure to use a strong, unique secret in production

### Security Notes
- Never commit your `.env` file to version control
- Keep your Twilio credentials and JWT secret secure
- Rotate your JWT secret and Twilio credentials periodically in production
- Use different credentials for development and production environments
