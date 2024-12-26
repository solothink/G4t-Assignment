# G4T assignment

This is a backend implementation for a Test Management Platform that allows creating, managing, and assigning tests to users.

## Features

1. User Authentication
   - Secure login with JWT
   - Role-based access control

2. Test Management
   - Create tests with title, description, and type
   - Fetch tests with optional filters
   - Assign tests to users
   - Calculate average marks

3. File Upload
   - Support for audio file uploads
   - File validation and size limits

4. Real-time Feedback
   - WebSocket integration for instant updates
   - Broadcast test submission results

## API Endpoints

### Authentication
- POST /api/auth/login - User login

### Tests
- POST /api/tests - Create a new test
- GET /api/tests - Get all tests
- POST /api/assign-test - Assign test to user
- GET /api/tests/testId/average-marks - Get average marks for a test

Extra(endpoint to assign test score - POST /api/tests/assignment/assignment-id/score)

### File Upload
- POST /api/upload/audio - Upload audio file

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create .env file with required environment variables:
   - MONGODB_URI
   - JWT_SECRET
   - PORT

3. Start the server:
   ```bash
   npm run dev
   ```

## Security Features

1. Password hashing using bcrypt
2. JWT-based authentication
3. Role-based access control
4. Request validation
5. File upload restrictions

## Real-time Integration

WebSocket implementation for instant feedback on test submissions:
- Connected clients receive real-time updates
- Scalable broadcast system
- Efficient message handling

## Database Schema

1. User Model
   - email
   - password (hashed)
   - role
   - createdAt

2. Test Model
   - title
   - description
   - type
   - questions
   - createdBy
   - createdAt

3. TestAssignment Model
   - test
   - user
   - assignedAt
   - completedAt
   - score

## Error Handling

- Comprehensive error handling for all endpoints
- Validation middleware for request data
- Proper HTTP status codes
- Detailed error messages

