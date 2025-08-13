# Tradition API Documentation

## Overview

The Tradition API provides endpoints for managing cultural traditions and heritage content, including creation, retrieval, updates, and operations related to traditional practices, customs, and cultural heritage.

## Base URL

```
/api/traditions
```

## Authentication

Most endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Create Tradition

Creates a new tradition.

**Endpoint:** `POST /api/traditions`

**Authentication:** Required (Admin role)

**Request Body:**

| Field       | Type    | Required | Example                                           |
| ----------- | ------- | -------- | ------------------------------------------------- |
| name        | string  | Yes      | `"Balinese Nyepi Ceremony"`                       |
| slug        | string  | Yes      | `"balinese-nyepi-ceremony"`                       |
| content     | string  | Yes      | `"Nyepi is the Balinese New Year celebration..."` |
| coverId     | string  | No       | `"img_123"`                                       |
| isPublished | boolean | No       | `true`                                            |

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "trad_clh7x2y3z0000qwerty123"
  },
  "message": "Tradition created successfully"
}
```

**Status Codes:**

- `201` - Tradition created successfully
- `400` - Validation error or missing required fields
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `409` - Slug already exists

---

### 2. Get All Traditions

Retrieves a paginated list of traditions.

**Endpoint:** `GET /api/traditions`

**Authentication:** Not required

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search by name or content
- `isPublished` (optional): Filter by publication status (default: true)
- `sortBy` (optional): Sort field (name, createdAt, updatedAt)
- `sortOrder` (optional): Sort order (asc, desc)

**Example Request:**

```
GET /api/traditions?page=1&limit=10&search=balinese&sortBy=name&sortOrder=asc
```

**Response:**

```json
{
  "success": true,
  "data": {
    "traditions": [
      {
        "id": "trad_clh7x2y3z0000qwerty123",
        "name": "Balinese Nyepi Ceremony",
        "slug": "balinese-nyepi-ceremony",
        "content": "Nyepi is the Balinese New Year celebration that involves a day of silence...",
        "isPublished": true,
        "cover": {
          "id": "img_123",
          "url": "https://example.com/images/nyepi.jpg",
          "publicId": "traditions/nyepi_123"
        },
        "_count": {
          "likes": 189,
          "bookmarks": 67,
          "comments": 23,
          "galleries": 8
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Status Codes:**

- `200` - Traditions retrieved successfully
- `400` - Invalid query parameters

---

### 3. Get Tradition by ID [Not Implement]

Retrieves a specific tradition by its ID.

**Endpoint:** `GET /api/traditions/:id`

**Authentication:** Not required

**Path Parameters:**

- `id`: Tradition ID (string)

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "trad_clh7x2y3z0000qwerty123",
    "name": "Balinese Nyepi Ceremony",
    "slug": "balinese-nyepi-ceremony",
    "content": "Nyepi is the Balinese New Year celebration that involves a day of silence, fasting, and meditation. The ceremony begins with Melasti, a purification ritual at the beach or water sources...",
    "isPublished": true,
    "cover": {
      "id": "img_123",
      "url": "https://example.com/images/nyepi.jpg",
      "publicId": "traditions/nyepi_123"
    },
    "galleries": [
      {
        "id": "gallery_123",
        "image": {
          "id": "img_789",
          "url": "https://example.com/gallery/nyepi1.jpg",
          "publicId": "traditions/gallery/nyepi1"
        },
        "createdAt": "2024-01-16T08:00:00.000Z"
      },
      {
        "id": "gallery_124",
        "image": {
          "id": "img_790",
          "url": "https://example.com/gallery/nyepi2.jpg",
          "publicId": "traditions/gallery/nyepi2"
        },
        "createdAt": "2024-01-16T08:15:00.000Z"
      }
    ],
    "comments": [
      {
        "id": "comment_123",
        "body": "Such a beautiful and meaningful tradition!",
        "author": {
          "id": "user_123",
          "name": "johndoe",
          "fullName": "John Doe",
          "profileImage": {
            "url": "https://example.com/profile.jpg"
          }
        },
        "createdAt": "2024-01-16T09:00:00.000Z",
        "replies": [
          {
            "id": "comment_124",
            "body": "I experienced this during my visit to Bali. Truly magical!",
            "author": {
              "id": "user_456",
              "name": "janedoe",
              "fullName": "Jane Doe"
            },
            "createdAt": "2024-01-16T10:00:00.000Z"
          }
        ]
      }
    ],
    "_count": {
      "likes": 189,
      "bookmarks": 67,
      "comments": 23,
      "galleries": 8
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**

- `200` - Tradition retrieved successfully
- `404` - Tradition not found

---

### 4. Get Tradition by Slug

Retrieves a specific tradition by its slug.

**Endpoint:** `GET /api/traditions/:slug`

**Authentication:** Not required

**Path Parameters:**

- `slug`: Tradition slug (string)

**Response:** Same as Get Tradition by ID

**Status Codes:**

- `200` - Tradition retrieved successfully
- `404` - Tradition not found

---

### 5. Update Tradition

Updates tradition information.

**Endpoint:** `PUT /api/traditions/:id`

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id`: Tradition ID (string)

**Request Body:**

| Field       | Type    | Required | Example                             |
| ----------- | ------- | -------- | ----------------------------------- |
| name        | string  | No       | `"Balinese Nyepi Day of Silence"`   |
| slug        | string  | No       | `"balinese-nyepi-day-of-silence"`   |
| content     | string  | No       | `"Updated detailed description..."` |
| coverId     | string  | No       | `"img_456"`                         |
| isPublished | boolean | No       | `false`                             |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "trad_clh7x2y3z0000qwerty123"
  },
  "message": "Tradition updated successfully"
}
```

**Status Codes:**

- `200` - Tradition updated successfully
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `404` - Tradition not found
- `409` - Slug already exists

---

### 6. Delete Tradition

Deletes a tradition.

**Endpoint:** `DELETE /api/traditions/:id`

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id`: Tradition ID (string)

**Request Body (for confirmation):**

| Field           | Type    | Required | Example |
| --------------- | ------- | -------- | ------- |
| confirmDeletion | boolean | Yes      | `true`  |

**Response:**

```json
{
  "success": true,
  "message": "Tradition deleted successfully"
}
```

**Status Codes:**

- `200` - Tradition deleted successfully
- `400` - Missing confirmation
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `404` - Tradition not found

---

### 7. Toggle Tradition Like

Likes or unlikes a tradition.

**Endpoint:** `POST /api/traditions/:id/like`

**Authentication:** Required

**Path Parameters:**

- `id`: Tradition ID (string)

**Response:**

```json
{
  "success": true,
  "data": {
    "liked": true,
    "likeCount": 190
  },
  "message": "Tradition liked successfully"
}
```

**Status Codes:**

- `200` - Like toggled successfully
- `401` - Unauthorized
- `404` - Tradition not found

---

### 8. Toggle Tradition Bookmark

Bookmarks or unbookmarks a tradition.

**Endpoint:** `POST /api/traditions/:id/bookmark`

**Authentication:** Required

**Path Parameters:**

- `id`: Tradition ID (string)

**Response:**

```json
{
  "success": true,
  "data": {
    "bookmarked": true,
    "bookmarkCount": 68
  },
  "message": "Tradition bookmarked successfully"
}
```

**Status Codes:**

- `200` - Bookmark toggled successfully
- `401` - Unauthorized
- `404` - Tradition not found

---

### 9. Add Comment to Tradition

Adds a comment to a tradition.

**Endpoint:** `POST /api/traditions/:id/comments`

**Authentication:** Required

**Path Parameters:**

- `id`: Tradition ID (string)

**Request Body:**

| Field    | Type   | Required | Example                                                   |
| -------- | ------ | -------- | --------------------------------------------------------- |
| body     | string | Yes      | `"Fascinating cultural practice! Thank you for sharing."` |
| parentId | string | No       | `"comment_123"`                                           |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "comment_456",
    "body": "Fascinating cultural practice! Thank you for sharing.",
    "author": {
      "id": "user_123",
      "name": "johndoe",
      "fullName": "John Doe"
    },
    "createdAt": "2024-01-20T10:15:00.000Z"
  },
  "message": "Comment added successfully"
}
```

**Status Codes:**

- `201` - Comment added successfully
- `400` - Validation error
- `401` - Unauthorized
- `404` - Tradition not found

---

### 10. Get Tradition Comments

Retrieves comments for a tradition.

**Endpoint:** `GET /api/traditions/:id/comments`

**Authentication:** Not required

**Path Parameters:**

- `id`: Tradition ID (string)

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**

```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "comment_123",
        "body": "Such a beautiful and meaningful tradition!",
        "author": {
          "id": "user_123",
          "name": "johndoe",
          "fullName": "John Doe",
          "profileImage": {
            "url": "https://example.com/profile.jpg"
          }
        },
        "replies": [
          {
            "id": "comment_124",
            "body": "I experienced this during my visit to Bali. Truly magical!",
            "author": {
              "id": "user_456",
              "name": "janedoe",
              "fullName": "Jane Doe"
            },
            "createdAt": "2024-01-16T10:00:00.000Z"
          }
        ],
        "createdAt": "2024-01-16T09:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 23,
      "pages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Status Codes:**

- `200` - Comments retrieved successfully
- `404` - Tradition not found

---

### 11. Update Comment

Updates a comment on a tradition.

**Endpoint:** `PUT /api/traditions/:id/comments/:commentId`

**Authentication:** Required (Comment author or Admin)

**Path Parameters:**

- `id`: Tradition ID (string)
- `commentId`: Comment ID (string)

**Request Body:**

| Field | Type   | Required | Example                                                              |
| ----- | ------ | -------- | -------------------------------------------------------------------- |
| body  | string | Yes      | `"Updated: This tradition is even more fascinating than I thought!"` |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "comment_123",
    "body": "Updated: This tradition is even more fascinating than I thought!",
    "updatedAt": "2024-01-20T11:30:00.000Z"
  },
  "message": "Comment updated successfully"
}
```

**Status Codes:**

- `200` - Comment updated successfully
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden (can only update own comments)
- `404` - Tradition or comment not found

---

### 12. Delete Comment

Deletes a comment from a tradition.

**Endpoint:** `DELETE /api/traditions/:id/comments/:commentId`

**Authentication:** Required (Comment author or Admin)

**Path Parameters:**

- `id`: Tradition ID (string)
- `commentId`: Comment ID (string)

**Response:**

```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

**Status Codes:**

- `200` - Comment deleted successfully
- `401` - Unauthorized
- `403` - Forbidden (can only delete own comments or admin)
- `404` - Tradition or comment not found

---

### 13. Add Gallery Image

Adds an image to tradition gallery.

**Endpoint:** `POST /api/traditions/:id/gallery`

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id`: Tradition ID (string)

**Request Body:**

| Field   | Type   | Required | Example     |
| ------- | ------ | -------- | ----------- |
| imageId | string | Yes      | `"img_789"` |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "gallery_456",
    "image": {
      "id": "img_789",
      "url": "https://example.com/gallery/tradition.jpg",
      "publicId": "traditions/gallery/tradition_789"
    },
    "createdAt": "2024-01-20T10:30:00.000Z"
  },
  "message": "Gallery image added successfully"
}
```

**Status Codes:**

- `201` - Gallery image added successfully
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `404` - Tradition or image not found

---

### 14. Remove Gallery Image

Removes an image from tradition gallery.

**Endpoint:** `DELETE /api/traditions/:id/gallery/:galleryId`

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id`: Tradition ID (string)
- `galleryId`: Gallery ID (string)

**Response:**

```json
{
  "success": true,
  "message": "Gallery image removed successfully"
}
```

**Status Codes:**

- `200` - Gallery image removed successfully
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `404` - Tradition or gallery image not found

---

### 15. Get Tradition Gallery

Retrieves all gallery images for a tradition.

**Endpoint:** `GET /api/traditions/:id/gallery`

**Authentication:** Not required

**Path Parameters:**

- `id`: Tradition ID (string)

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**

```json
{
  "success": true,
  "data": {
    "galleries": [
      {
        "id": "gallery_123",
        "image": {
          "id": "img_789",
          "url": "https://example.com/gallery/nyepi1.jpg",
          "publicId": "traditions/gallery/nyepi1"
        },
        "createdAt": "2024-01-16T08:00:00.000Z"
      },
      {
        "id": "gallery_124",
        "image": {
          "id": "img_790",
          "url": "https://example.com/gallery/nyepi2.jpg",
          "publicId": "traditions/gallery/nyepi2"
        },
        "createdAt": "2024-01-16T08:15:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 8,
      "pages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

**Status Codes:**

- `200` - Gallery retrieved successfully
- `404` - Tradition not found

---

## Data Models

### Tradition Object

```json
{
  "id": "string", // Unique identifier (cuid)
  "name": "string", // Tradition name (required)
  "slug": "string", // URL-friendly slug (unique, required)
  "content": "string", // Tradition description (required)
  "coverId": "string|null", // Cover image ID
  "isPublished": "boolean", // Publication status (default: true)
  "cover": "Image|null", // Cover image object
  "galleries": "Gallery[]", // Gallery images
  "likes": "Like[]", // User likes
  "bookmarks": "Bookmark[]", // User bookmarks
  "comments": "Comment[]", // User comments
  "createdAt": "string", // ISO 8601 timestamp
  "updatedAt": "string" // ISO 8601 timestamp
}
```

### Gallery Object (for Traditions)

```json
{
  "id": "string",
  "imageId": "string|null",
  "traditionId": "string|null",
  "destinationId": "string|null",
  "image": "Image|null",
  "tradition": "Tradition|null",
  "destination": "Destination|null",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Comment Object (for Traditions)

```json
{
  "id": "string",
  "body": "string",
  "userId": "string",
  "traditionId": "string|null",
  "destinationId": "string|null",
  "storyId": "string|null",
  "parentId": "string|null",
  "author": "User",
  "tradition": "Tradition|null",
  "destination": "Destination|null",
  "story": "Story|null",
  "parent": "Comment|null",
  "replies": "Comment[]",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Bookmark Object (for Traditions)

```json
{
  "id": "string",
  "userId": "string",
  "traditionId": "string|null",
  "destinationId": "string|null",
  "storyId": "string|null",
  "user": "User",
  "tradition": "Tradition|null",
  "destination": "Destination|null",
  "story": "Story|null",
  "createdAt": "string"
}
```

### Like Object

```json
{
  "id": "string",
  "userId": "string",
  "traditionId": "string|null",
  "destinationId": "string|null",
  "storyId": "string|null",
  "user": "User",
  "tradition": "Tradition|null",
  "destination": "Destination|null",
  "story": "Story|null",
  "createdAt": "string"
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
- `CONFLICT` - Resource already exists (slug conflict)
- `INTERNAL_ERROR` - Server error

---

## Rate Limiting

The API implements rate limiting:

- **General endpoints:** 100 requests per minute per IP
- **Content creation endpoints:** 30 requests per hour per user
- **Like/bookmark endpoints:** 50 requests per minute per user
- **Comment endpoints:** 25 requests per hour per user

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

1. **Content Required:** Unlike destinations, tradition content is required and cannot be null
2. **Slug Uniqueness:** Tradition slugs must be unique across all traditions
3. **Cultural Sensitivity:** Content should be reviewed for cultural accuracy and sensitivity
4. **Cascade Deletion:** When a tradition is deleted, associated galleries, comments, likes, and bookmarks are also deleted
5. **Image Relations:** Cover images and gallery images are referenced through the Image model
6. **Comments System:** Supports nested comments through parent-child relationships
7. **Content Filtering:** Published/unpublished content can be filtered based on user permissions
8. **Search Functionality:** Full-text search available on name and content fields
9. **Heritage Documentation:** Ideal for documenting cultural practices, ceremonies, and traditional knowledge
10. **Community Engagement:** Users can interact through likes, bookmarks, and comments to preserve cultural knowledge
