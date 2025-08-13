# User API Documentation

## Overview

The User API provides endpoints for managing user accounts, including registration, authentication, profile management, and user data operations.

## Base URL

```
/api/users
```

## Authentication

Most endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Create User (Registration)

Creates a new user account.

**Endpoint:** `POST /api/users`

**Authentication:** Not required

**Request Body:**

| Field    | Type   | Required | Example                                            |
| -------- | ------ | -------- | -------------------------------------------------- |
| email    | string | No       | `"john.doe@example.com"`                           |
| name     | string | Yes      | `"johndoe"`                                        |
| fullName | string | No       | `"John Doe"`                                       |
| password | string | Yes      | `"securePassword123"`                              |
| bio      | string | No       | `"Software developer passionate about technology"` |

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "clh7x2y3z0000qwerty123"
  },
  "message": "User created successfully"
}
```

**Status Codes:**

- `201` - User created successfully
- `400` - Validation error or missing required fields
- `409` - Email or username already exists

---

### 2. Login

User login

**Endpoint:** `POST /api/users/login`

**Authentication:** Not required

**Request Body:**

| Field    | Type   | Required | Example               |
| -------- | ------ | -------- | --------------------- |
| name     | string | Yes      | `"johndoe"`           |
| password | string | Yes      | `"securePassword123"` |

**Response:**

```json
{
  "success": true,
  "result": {
    "accessToken": "clh7x2y3z0000qwerty123"
  },
  "message": "User created successfully"
}
```

**Status Codes:**

- `200` - User login success
- `400` - Validation error or missing required fields
- `409` - Email or username already exists

---

### 3. Get Token

Get user access token while old token is expired

**Endpoint:** `GET /api/token`

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "result": {
    "accessToken": "clh7x2y3z0000qwerty123"
  },
  "message": "New token generated succesfully"
}
```

**Status Codes:**

- `200` - User login success
- `400` - Validation error or missing required fields
- `409` - Email or username already exists

---

### 4. Get All Users

Retrieves a paginated list of users.

**Endpoint:** `GET /api/users`

**Authentication:** Required (Admin role)

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search by name, fullName, or email
- `role` (optional): Filter by user role

**Example Request:**

```
GET /api/users?page=1&limit=10&search=john&role=USER
```

**Response:**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "clh7x2y3z0000qwerty123",
        "email": "john.doe@example.com",
        "name": "johndoe",
        "fullName": "John Doe",
        "bio": "Software developer passionate about technology",
        "role": "USER",
        "profileImage": {
          "id": "img_123",
          "url": "https://example.com/images/profile.jpg",
          "alt": "Profile picture"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Status Codes:**

- `200` - Users retrieved successfully
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)

---

### 5. Get User by ID

Retrieves a specific user by their ID.

**Endpoint:** `GET /api/users/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: User ID (string)

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "clh7x2y3z0000qwerty123",
    "email": "john.doe@example.com",
    "name": "johndoe",
    "fullName": "John Doe",
    "bio": "Software developer passionate about technology",
    "role": "USER",
    "profileImage": {
      "id": "img_123",
      "url": "https://example.com/images/profile.jpg"
    },
    "stories": [
      {
        "id": "story_123",
        "name": "My First Story",
        "slug": "my-first-story"
        "createdAt": "2024-01-16T09:00:00.000Z",
        "updatedAt": "2024-01-16T09:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "_count": {
      "likes": 0,
      "bookmarks": 0,
      "stories": 0,
      "comment": 0,
      "activityLogs": 0
    }
  }
}
```

**Status Codes:**

- `200` - User retrieved successfully
- `401` - Unauthorized
- `404` - User not found

---

### 6. Get Current User Profile

Retrieves the authenticated user's profile.

**Endpoint:** `GET /api/me`

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "clh7x2y3z0000qwerty123",
    "email": "john.doe@example.com",
    "name": "johndoe",
    "fullName": "John Doe",
    "bio": "Software developer passionate about technology",
    "role": "USER",
    "profileImage": {
      "id": "img_123",
      "url": "https://example.com/images/profile.jpg",
      "alt": "Profile picture"
    },
    "_count": {
      "likes": 0,
      "bookmarks": 0,
      "stories": 0,
      "comment": 0,
      "activityLogs": 0
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**

- `200` - Profile retrieved successfully
- `401` - Unauthorized

---

### 7. Update User

Updates user information. Users can only update their own profile unless they have admin privileges.

**Endpoint:** `PUT /api/users/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: User ID (string)

**Request Body:**

| Field        | Type   | Required | Example                                                |
| ------------ | ------ | -------- | ------------------------------------------------------ |
| fullName     | string | No       | `"John Michael Doe"`                                   |
| bio          | string | No       | `"Senior Software Developer with 5+ years experience"` |
| profileImage | object | No       | {"url": "...", "publicId": "..."}                      |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "clh7x2y3z0000qwerty123"
  },
  "message": "User updated successfully"
}
```

**Status Codes:**

- `200` - User updated successfully
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden (can't update other users)
- `404` - User not found
- `409` - Username already exists (if updating name)

---

### 8. Update User Password

Updates the user's password.

**Endpoint:** `PATCH /api/users/:id/password`

**Authentication:** Required

**Path Parameters:**

- `id`: User ID (string)

**Request Body:**

| Field           | Type   | Required | Example                  |
| --------------- | ------ | -------- | ------------------------ |
| currentPassword | string | Yes      | `"oldPassword123"`       |
| newPassword     | string | Yes      | `"newSecurePassword456"` |
| confirmPassword | string | Yes      | `"newSecurePassword456"` |

**Response:**

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Status Codes:**

- `200` - Password updated successfully
- `400` - Validation error or passwords don't match
- `401` - Unauthorized or incorrect current password
- `403` - Forbidden
- `404` - User not found

---

### 9. Update User Role

Updates a user's role (Admin only).

**Endpoint:** `PATCH /api/users/:id/role`

**Authentication:** Required (Admin only)

**Path Parameters:**

- `id`: User ID (string)

**Request Body:**

| Field | Type   | Required | Example               |
| ----- | ------ | -------- | --------------------- |
| role  | string | Yes      | `"ADMIN"` or `"USER"` |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "clh7x2y3z0000qwerty123",
    "name": "johndoe",
    "fullName": "John Doe",
    "role": "ADMIN",
    "updatedAt": "2024-01-20T16:30:00.000Z"
  },
  "message": "User role updated successfully"
}
```

**Status Codes:**

- `200` - Role updated successfully
- `400` - Invalid role
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `404` - User not found

---

### 10. Delete User

Deletes a user account. Users can only delete their own account unless they have admin privileges.

**Endpoint:** `DELETE /api/users/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: User ID (string)

**Request Body (for confirmation):**

| Field           | Type    | Required | Example             |
| --------------- | ------- | -------- | ------------------- |
| confirmDeletion | boolean | Yes      | `true`              |
| password        | string  | Yes      | `"userPassword123"` |

**Response:**

```json
{
  "success": true,
  "message": "User account deleted successfully"
}
```

**Status Codes:**

- `200` - User deleted successfully
- `400` - Missing confirmation or incorrect password
- `401` - Unauthorized
- `403` - Forbidden (can't delete other users)
- `404` - User not found

---

### 11. Get User Activity

Retrieves user's activity logs.

**Endpoint:** `GET /api/users/:id/activity`

**Authentication:** Required

**Path Parameters:**

- `id`: User ID (string)

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `type` (optional): Filter by activity type

**Response:**

```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "activity_123",
        "type": "STORY_CREATED",
        "description": "Created a new story",
        "metadata": {
          "storyId": "story_456",
          "storyTitle": "My Journey"
        },
        "createdAt": "2024-01-20T10:15:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Status Codes:**

- `200` - Activity retrieved successfully
- `401` - Unauthorized
- `403` - Forbidden (can only view own activity)
- `404` - User not found

---

## Data Models

### User Object

```json
{
  "id": "string", // Unique identifier (cuid)
  "email": "string|null", // Email address (unique)
  "name": "string", // Username (unique)
  "fullName": "string|null", // Full display name
  "password": "string|null", // Hashed password (never returned in responses)
  "bio": "string|null", // User biography
  "refreshToken": "string|null", // JWT refresh token (internal use)
  "role": "USER|ADMIN", // User role
  "profileImage": "Image|null", // Profile image object
  "stories": "Story[]", // User's stories (when included)
  "likes": "Like[]", // User's likes (when included)
  "bookmarks": "Bookmark[]", // User's bookmarks (when included)
  "comments": "Comment[]", // User's comments (when included)
  "activityLogs": "ActivityLog[]", // User's activity logs (when included)
  "createdAt": "string", // ISO 8601 timestamp
  "updatedAt": "string" // ISO 8601 timestamp
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details (optional)"
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Request validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting

The API implements rate limiting:

- **General endpoints:** 100 requests per minute per IP
- **Authentication endpoints:** 10 requests per minute per IP
- **Profile updates:** 20 requests per hour per user

When rate limit is exceeded:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

---

## Notes

1. **Password Security:** Passwords are hashed using bcrypt before storage
2. **Data Privacy:** Password and refreshToken fields are never returned in API responses
3. **Cascade Deletion:** When a user is deleted, their profile image is also deleted (if not used elsewhere)
4. **Unique Constraints:** Both email and name (username) must be unique across all users
5. **Role-based Access:** Some endpoints require specific roles for access
6. **Soft Deletion:** Consider implementing soft deletion for better data integrity
