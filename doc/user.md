# API Documentation: User & Authentication

This document covers all endpoints related to user management and the authentication process.

## 🏢 Data Model: User

The `User` object has the following data structure, based on the Prisma schema:

| Field            | Type                    | Description                                        |
| :--------------- | :---------------------- | :------------------------------------------------- |
| `id`             | `String` (CUID)         | A unique identifier for the user.                  |
| `email`          | `String` (Optional)     | The user's unique email address.                   |
| `name`           | `String`                | The user's unique username.                        |
| `fullName`       | `String` (Optional)     | The user's full name.                              |
| `password`       | `String` (Optional)     | The user's hashed password.                        |
| `bio`            | `String` (Optional)     | A short biography of the user.                     |
| `refreshToken`   | `String` (Optional)     | The token used to refresh the access token.        |
| `profileImageId` | `String` (Optional)     | The ID of the linked profile image.                |
| `role`           | `Enum` (`USER`/`ADMIN`) | The user's role in the system, defaults to `USER`. |
| `createdAt`      | `DateTime`              | The timestamp when the user was created.           |
| `updatedAt`      | `DateTime`              | The timestamp when the user was last updated.      |

---

## 🔐 Authentication

Endpoints that require authentication must include a **JWT Access Token** in the `Authorization` header.

**Example Header:**

```http
Authorization: Bearer <ACCESS_TOKEN>
```

---

## Endpoints

The endpoints are divided into three categories: **Public**, **Authenticated (User)**, and **Admin**.

### 🌐 Public Endpoints

These endpoints can be accessed without authentication.

#### 1. Register a New User

Registers a new user in the system.

- **Method**: `POST`
- **Endpoint**: `/register`

**Request Body**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | Yes | Username, min 3 characters, max 30. |
| `password` | `string` | Yes | User's password. |
| `email` | `string` | No | Email address. Must be a valid email format. |
| `fullName`| `string` | No | Full name, min 3 characters, max 50. |
| `bio` | `string` | No | Biography, max 200 characters. |

**Example Request Body:**

```json
{
  "name": "johndoe",
  "password": "Password123",
  "email": "johndoe@example.com",
  "fullName": "John Doe"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User created successfully",
  "result": {
    "id": "clwdb9xkb000008l430s1h1g1"
  }
}
```

**Possible Errors:**

- `400 Bad Request`: If validation fails (e.g., username is too short) or the username already exists.

---

#### 2. User Login

Authenticates a user and returns an access token.

- **Method**: `POST`
- **Endpoint**: `/login`

**Request Body**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | Yes | User's username. |
| `password` | `string` | Yes | User's password (min 8 characters, must contain uppercase, lowercase, and a number). |

**Example Request Body:**

```json
{
  "name": "johndoe",
  "password": "Password123"
}
```

**Success Response (200 OK):**

- The `refreshToken` is stored in an `httpOnly` cookie.

```json
{
  "success": true,
  "message": "User login successfully",
  "result": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Possible Errors:**

- `400 Bad Request`: If the username or password is invalid.

---

#### 3. Refresh Access Token

Generates a new access token using the `refreshToken` from the cookie.

- **Method**: `GET`
- **Endpoint**: `/token`

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "New token generated successfully",
  "result": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Possible Errors:**

- `401 Unauthorized`: If the `refreshToken` cookie is missing.
- `403 Forbidden`: If the `refreshToken` is invalid or not found in the database.

---

#### 4. Get a List of Users

Retrieves a list of all users with filtering and pagination.

- **Method**: `GET`
- **Endpoint**: `/users`

**Query Parameters**
| Parameter | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `page` | `number` | The current page number. | `1` |
| `limit` | `number` | The number of items per page. | `10` |
| `search` | `string` | Search by `name`, `email`, or `fullName`. | - |
| `role` | `string` | Filter by role (`USER` or `ADMIN`). | - |
| `sortBy` | `string` | Sort by (`createdAt` or `updatedAt`).| `createdAt` |
| `orderBy`| `string` | Sort direction (`asc` or `desc`). | `desc` |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "gets user successfully",
  "result": {
    "users": [
      {
        "id": "clwdb9xkb000008l430s1h1g1",
        "email": "johndoe@example.com",
        "name": "johndoe",
        "fullName": "John Doe",
        "bio": "A passionate developer.",
        "role": "USER",
        "createdAt": "2025-08-27T10:00:00.000Z",
        "updatedAt": "2025-08-27T10:00:00.000Z",
        "profileImage": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

#### 5. Get User by Username

Retrieves a single user's details by their `name` (username).

- **Method**: `GET`
- **Endpoint**: `/users/:name`

**Path Parameters**
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | The unique username of the user. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "get user successfully",
  "result": {
    "id": "clwdb9xkb000008l430s1h1g1",
    "fullName": "John Doe",
    "name": "johndoe",
    "_count": {
      "stories": 5,
      "likes": 12,
      "bookmarks": 3,
      "comments": 8
    },
    "bio": "A passionate developer.",
    "email": "johndoe@example.com",
    "stories": [],
    "createdAt": "2025-08-27T10:00:00.000Z",
    "updatedAt": "2025-08-27T10:00:00.000Z",
    "role": "USER"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a user with the specified `name` is not found.

---

### 👤 Authenticated User Endpoints

These endpoints require a **valid token** (the user must be logged in).

#### 1. Get Current User's Profile

Retrieves the profile details of the currently logged-in user.

- **Method**: `GET`
- **Endpoint**: `/me`
- **Authentication**: **Required**

**Success Response (200 OK):**
The response is identical to "Get User by Username".

```json
{
  "success": true,
  "result": {
    "id": "clwdb9xkb000008l430s1h1g1",
    "fullName": "John Doe",
    "name": "johndoe"
    // ... other user details
  }
}
```

**Possible Errors:**

- `403 Forbidden`: If the token is invalid or missing.

---

#### 2. Update User Profile

Updates a user's data. A regular user can only update their own profile. An admin can update any user's profile via their ID.

- **Method**: `PATCH`
- **Endpoint**: `/users/:id`
- **Authentication**: **Required**

**Path Parameters**
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | The CUID of the user to be updated. |

**Request Body**
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `fullName`| `string` | No | New full name, min 3, max 50 characters. |
| `bio` | `string` | No | New biography, max 200 characters. |
| `profileImageId`|`string`| No | CUID of the new profile image. |

**Example Request Body:**

```json
{
  "fullName": "John Doe Updated",
  "bio": "An even more passionate developer."
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "update user successfully",
  "result": {
    "id": "clwdb9xkb000008l430s1h1g1"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a user with the specified `id` is not found.
- `400 Bad Request`: If the request body validation fails.

---

### 🛡️ Admin Endpoints

These endpoints require both a **valid token** and an **Admin role**.

#### 1. Delete a User

Deletes a user by their ID.

- **Method**: `DELETE`
- **Endpoint**: `/users/:id`
- **Authentication**: **Admin Required**

**Path Parameters**
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | The CUID of the user to be deleted. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "delete user successfully",
  "result": {
    "id": "clwdbe4yf000108l4g8h35k4a"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a user with the specified `id` is not found.
- `400 Bad Request`: If an admin tries to delete themself or another admin.
