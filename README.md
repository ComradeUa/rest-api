# Task Management REST API

A production-ready REST API built with NestJS for task management with Pomodoro timer integration. Features user authentication, task CRUD operations, and productivity tracking.

## Features

- **User Authentication**
  - JWT-based authentication with access and refresh tokens
  - Secure password hashing with Argon2
  - Cookie-based refresh token management
- **Task Management**
  - Create, read, update, and delete tasks
  - Task prioritization (LOW, MEDIUM, HIGH)
  - Task completion tracking
  - Tag support for task categorization
- **User Profile**
  - Profile statistics (total tasks, completed tasks, today's tasks, week's tasks)
  - Pomodoro timer settings (work interval, break interval, intervals count)
  - Profile customization
- **Productivity Tracking**
  - Daily and weekly task statistics
  - Completion rate monitoring
  - Time-based analytics using date-fns

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (Passport.js)
- **Validation:** class-validator
- **Password Hashing:** Argon2
- **Date Utils:** date-fns

## Prerequisites

- Node.js 18+ or Docker
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ComradeUa/rest-api.git
cd rest-api
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
JWT_SECRET="your-secret-key"
SECRET_KEY_SESSION="your-session-secret"
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Generate Prisma client:

```bash
npx prisma generate
```

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

### Docker

```bash
docker build -t rest-api .
docker run -p 5200:5200 rest-api
```

The API will be available at `http://localhost:5200`

## API Documentation

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

#### Refresh Token

```http
POST /api/auth/login/access-token
Cookie: refresh_token=<token>
```

### User Profile

#### Get Profile

```http
GET /api/user/profile
Authorization: Bearer <access_token>
```

#### Update Profile

```http
PUT /api/user/profile/update
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "workInterval": 25,
  "breakInterval": 5,
  "intervalsCount": 4
}
```

### Tasks

#### Get All Tasks

```http
GET /api/user/task/get-tasks
Authorization: Bearer <access_token>
```

#### Create Task

```http
POST /api/user/task/create
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the REST API",
  "priority": "HIGH",
  "tags": ["work", "urgent"]
}
```

#### Update Task

```http
PUT /api/user/task/update/:taskId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated title",
  "isCompleted": true,
  "priority": "MEDIUM"
}
```

#### Delete Task

```http
DELETE /api/user/task/delete/:taskId
Authorization: Bearer <access_token>
```

## Project Structure

```
src/
├── auth/               # Authentication module
│   ├── guards/         # JWT auth guards
│   ├── decorators/     # Custom decorators
│   └── dto/            # Data transfer objects
├── users/              # User management module
│   ├── dto/            # User DTOs
│   └── users.service.ts
├── task/               # Task management module
│   ├── dto/            # Task DTOs
│   └── task.service.ts
├── prisma/             # Prisma module
└── config/             # Configuration files

prisma/
├── schema.prisma       # Database schema
└── migrations/         # Database migrations
```

## Database Schema

### User

- id (String, CUID)
- email (String, unique)
- password (String, hashed)
- name (String, optional)
- workInterval (Int, default: 50 minutes)
- breakInterval (Int, default: 10 minutes)
- intervalsCount (Int, default: 7)
- createdAt (DateTime)
- updatedAt (DateTime)

### Task

- id (String, CUID)
- title (String, required)
- description (String, optional)
- isCompleted (Boolean, default: false)
- priority (Enum: LOW, MEDIUM, HIGH)
- userId (String, foreign key)
- createdAt (DateTime)
- updatedAt (DateTime)

### Tag

- id (String, CUID)
- task_id (String, foreign key)
- name (String)
- color (String, optional)

## Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:prod` - Start in production mode
- `npm run build` - Build the application
- `npm run lint` - Lint the code
- `npm run format` - Format the code with Prettier
- `npm test` - Run tests

## Environment Variables

| Variable           | Description                      | Required |
| ------------------ | -------------------------------- | -------- |
| DATABASE_URL       | PostgreSQL connection string     | Yes      |
| JWT_SECRET         | Secret key for JWT tokens        | Yes      |
| SECRET_KEY_SESSION | Secret key for sessions          | Yes      |
| PORT               | Application port (default: 5200) | No       |

## Security Features

- Password hashing with Argon2
- JWT access and refresh tokens
- HttpOnly cookies for refresh tokens
- CORS configuration
- Input validation with class-validator
- SQL injection protection via Prisma

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License.

## Author

Ivan Yuzov

## Support

For support, email yuzovivan@icloud.com or open an issue in the repository.
