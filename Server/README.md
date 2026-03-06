# API Sentinel - API Monitoring SaaS

A SaaS application for monitoring API endpoints with automated health checks and email alerts.

## Features

- ✅ User authentication and project management
- ✅ API registration for monitoring (GET, POST, PUT, PATCH, DELETE)
- ✅ **Authentication Support**: Bearer tokens, API keys, Basic auth, custom headers
- ✅ **Custom Monitoring Intervals**: 1, 5, 10, 15, 30, or 60 minutes
- ✅ **Dry-run Monitoring**: Safe monitoring of POST/PUT/PATCH/DELETE without sending production data
- ✅ Automated health checks with multiple fallback strategies
- ✅ Basic logging of monitoring results
- ✅ Email alerts when APIs go down
- ✅ Monitoring dashboard with logs and statistics

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT
- **Monitoring**: node-cron + axios
- **Email**: nodemailer

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 3. Environment Configuration

Update your `.env` file with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/api-sentinal"
PORT=4000
JWT_SECRET="your-jwt-secret"

# Email Configuration (for alerts)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

**For Gmail SMTP:**
1. Enable 2-factor authentication
2. Generate an App Password: https://support.google.com/accounts/answer/185833
3. Use the App Password in `SMTP_PASS`

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Test Monitoring
```bash
npm run test-monitoring
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user

### Projects
- `POST /api/v1/user/projects` - Create project
- `GET /api/v1/user/projects` - Get user's projects
- `GET /api/v1/user/projects/:projectId` - Get project by ID
- `PATCH /api/v1/user/projects/:projectId` - Update project
- `DELETE /api/v1/user/projects/:projectId` - Delete project

### APIs
- `POST /api/v1/user/apis/:projectId/apis` - Register API for monitoring
- `GET /api/v1/user/apis/:projectId/apis` - Get all APIs in project
- `GET /api/v1/user/apis/:projectId/api/:apiId` - Get API details
- `PATCH /api/v1/user/apis/:projectId/api/:apiId` - Update API
- `DELETE /api/v1/user/apis/:projectId/api/:apiId` - Delete API

### Monitoring
- `GET /api/v1/user/apis/:projectId/api/:apiId/logs?limit=50&days=7` - Get monitoring logs
- `GET /api/v1/user/apis/:projectId/api/:apiId/stats?days=7` - Get API statistics
- `POST /api/v1/user/apis/:projectId/api/:apiId/check` - Trigger immediate API check

## API Registration with Authentication

When registering an API, you can specify authentication details:

### Authentication Types Supported:
- **NONE**: No authentication (public APIs)
- **BEARER_TOKEN**: `Authorization: Bearer {token}`
- **API_KEY**: Custom header with API key (e.g., `X-API-Key: {key}`)
- **BASIC_AUTH**: HTTP Basic authentication
- **CUSTOM_HEADER**: Any custom header with value

### Registration Example:
```json
POST /api/v1/user/apis/{projectId}/apis
{
  "title": "User API",
  "url": "https://api.example.com/users",
  "method": "GET",
  "intervalMinutes": 5,
  "expectedStatusCodes": [200, 201],
  "isActive": true,
  "authType": "BEARER_TOKEN",
  "authToken": "your-jwt-token-here"
}
```

### Custom Intervals:
Choose from: 1, 5, 10, 15, 30, or 60 minutes

## Monitoring System

### How It Works

1. **Multi-interval Scheduler**: Separate cron jobs for each interval (1, 5, 10, 15, 30, 60 minutes)
2. **Authentication**: Automatically applies configured auth headers to requests
3. **Smart Monitoring**:
   - **GET**: Normal HTTP requests
   - **POST/PUT/PATCH/DELETE**: Dry-run monitoring (HEAD → OPTIONS → health endpoints)
4. **Logging**: Records status, response time, and timestamp
5. **Alerts**: Sends email when API returns unexpected status code

### Dry-run Monitoring Strategy

For non-GET methods, the system uses safe monitoring approaches:

1. **HEAD Request**: Checks if endpoint is reachable without sending body
2. **OPTIONS Request**: Alternative reachability check
3. **Health Endpoints**: Tries `/health`, `/status`, `/ping` variations
4. **Never sends production data** to POST/PUT/PATCH/DELETE endpoints

### Monitoring Data

Each check creates an `ApiCheckLog` record with:
- `status`: UP or DOWN
- `statusCode`: HTTP response code
- `responseTimeMs`: Response time in milliseconds
- `checkedAt`: Timestamp of check

### Email Alerts

Alerts are sent when:
- API returns status code not in `expectedStatusCodes` array
- API request fails (timeout, network error, etc.)

## Testing the System

### 1. Register a user and create a project

### 2. Add APIs with different configurations:

**Public GET API (no auth):**
```json
POST /api/v1/user/apis/{projectId}/apis
{
  "title": "Public API",
  "url": "https://httpbin.org/get",
  "method": "GET",
  "intervalMinutes": 5,
  "expectedStatusCodes": [200],
  "isActive": true,
  "authType": "NONE"
}
```

**Protected API with Bearer Token:**
```json
POST /api/v1/user/apis/{projectId}/apis
{
  "title": "Protected API",
  "url": "https://api.example.com/users",
  "method": "GET",
  "intervalMinutes": 10,
  "expectedStatusCodes": [200, 201],
  "isActive": true,
  "authType": "BEARER_TOKEN",
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**POST API with API Key (dry-run monitoring):**
```json
POST /api/v1/user/apis/{projectId}/apis
{
  "title": "POST API",
  "url": "https://api.example.com/users",
  "method": "POST",
  "intervalMinutes": 15,
  "expectedStatusCodes": [201],
  "isActive": true,
  "authType": "API_KEY",
  "authHeaderName": "X-API-Key",
  "authToken": "your-api-key-here"
}
```

### 3. Test monitoring:
```bash
# Manual test (checks all active APIs)
npm run test-monitoring

# Or wait for scheduled checks based on intervals
```

### 4. View results:
```bash
# Get monitoring logs
GET /api/v1/user/apis/{projectId}/api/{apiId}/logs

# Get statistics
GET /api/v1/user/apis/{projectId}/api/{apiId}/stats
```

## Future Enhancements (Post-MVP)

- Support for POST/PUT/DELETE monitoring
- Custom monitoring intervals
- Webhook notifications
- Slack/Teams integrations
- Advanced analytics and reporting
- Multi-user project collaboration
- API response validation
- SSL certificate monitoring

## Project Structure

```
src/
├── app.js                 # Express app setup
├── config/
│   └── db.js             # Database connection
├── controllers/
│   ├── authControllers.js
│   ├── apiControllers/
│   └── projectControllers/
├── middlewares/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── routes/
│   ├── authRoutes.js
│   ├── apiRoutes/
│   └── projectRoutes/
├── services/
│   ├── apiServices/
│   ├── projectServices/
│   └── monitoringServices/  # New: Monitoring logic
└── utills/
    ├── appError.js
    ├── generateToken.js
    └── prisma client
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC