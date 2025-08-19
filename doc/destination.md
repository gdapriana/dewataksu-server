# Destination API Documentation

## Overview

The Destination API provides endpoints for managing tourist destinations, including creation, retrieval, updates, and operations related to destinations, districts, categories, and associated media.

## Base URL

```
/destinations
```

## Authentication

Most endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Create Destination

Creates a new destination.

**Endpoint:** `POST /destinations`

**Authentication:** Required (Admin role)

**Request Body:**

| Field       | Type     | Required | Example                                |
| ----------- | -------- | -------- | -------------------------------------- |
| name        | string   | Yes      | `"Borobudur Temple"`                   |
| content     | string   | No       | `"Ancient Buddhist temple in Java"`    |
| address     | string   | No       | `"Jl. Badrawati, Borobudur, Magelang"` |
| mapUrl      | string   | No       | `"https://maps.google.com/..."`        |
| price       | number   | No       | `50000`                                |
| coverId     | string   | No       | `"img_123"`                            |
| districtId  | string   | Yes      | `"district_123"`                       |
| categoryId  | string   | Yes      | `"category_123"`                       |
| isPublished | boolean  | No       | `true`                                 |
| tags        | string[] | No       | `["temple", "buddhist", "heritage"]`   |

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "dest_clh7x2y3z0000qwerty123"
  },
  "message": "Destination created successfully"
}
```

**Status Codes:**

- `201` - Destination created successfully
- `400` - Validation error or missing required fields
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `409` - Slug already exists

---

### 2. Get All Destinations

Retrieves a paginated list of destinations.

**Endpoint:** `GET /destinations`

**Authentication:** Not required

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search by name or content
- `categorySlug` (optional): Filter by category Slug
- `districtSlug` (optional): Filter by district Slug
- `tags` (optional): Filter by tags (comma-separated)
- `isPublished` (optional): Filter by publication status (default: true)
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `sortBy` (optional): Sort field (name, price, createdAt)
- `sortOrder` (optional): Sort order (asc, desc)

**Example Request:**

```
GET /api/destinations?page=1&limit=10&categoryId=cat_123&tags=temple,heritage&sortBy=name&sortOrder=asc
```

**Response:**

```json
{
  "success": true,
  "data": {
    "destinations": [
      {
        "id": "dest_clh7x2y3z0000qwerty123",
        "name": "Borobudur Temple",
        "slug": "borobudur-temple",
        "content": "Ancient Buddhist temple in Java",
        "address": "Jl. Badrawati, Borobudur, Magelang",
        "price": 50000,
        "isPublished": true,
        "cover": {
          "id": "img_123",
          "url": "https://example.com/images/borobudur.jpg",
          "publicId": "destinations/borobudur_123"
        },
        "category": {
          "id": "category_123",
          "name": "Historical Sites",
          "slug": "historical-sites"
        },
        "district": {
          "id": "district_123",
          "name": "Magelang",
          "slug": "magelang"
        },
        "tags": [
          {
            "id": "tag_123",
            "name": "Temple",
            "slug": "temple"
          }
        ],
        "_count": {
          "likes": 245,
          "bookmarks": 89,
          "comments": 34,
          "galleries": 12
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 156,
      "pages": 16,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Status Codes:**

- `200` - Destinations retrieved successfully
- `400` - Invalid query parameters

---

### 3. Get Destination by ID [Not implement]

Retrieves a specific destination by its ID.

**Endpoint:** `GET /api/destinations/:id`

**Authentication:** Not required

**Path Parameters:**

- `id`: Destination ID (string)

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "dest_clh7x2y3z0000qwerty123",
    "name": "Borobudur Temple",
    "slug": "borobudur-temple",
    "content": "Ancient Buddhist temple in Java...",
    "address": "Jl. Badrawati, Borobudur, Magelang",
    "mapUrl": "https://maps.google.com/...",
    "latitude": -7.6079,
    "longitude": 110.2038,
    "price": 50000,
    "isPublished": true,
    "cover": {
      "id": "img_123",
      "url": "https://example.com/images/borobudur.jpg",
      "publicId": "destinations/borobudur_123"
    },
    "category": {
      "id": "category_123",
      "name": "Historical Sites",
      "slug": "historical-sites"
    },
    "district": {
      "id": "district_123",
      "name": "Magelang",
      "slug": "magelang"
    },
    "tags": [
      {
        "id": "tag_123",
        "name": "Temple",
        "slug": "temple"
      },
      {
        "id": "tag_124",
        "name": "Buddhist",
        "slug": "buddhist"
      }
    ],
    "galleries": [
      {
        "id": "gallery_123",
        "image": {
          "id": "img_789",
          "url": "https://example.com/gallery/borobudur1.jpg"
        }
      }
    ],
    "comments": [
      {
        "id": "comment_123",
        "body": "Amazing place to visit!",
        "author": {
          "id": "user_123",
          "name": "johndoe",
          "profileImage": {
            "url": "..."
          }
        },
        "createdAt": "2024-01-16T09:00:00.000Z",
        "replies": []
      }
    ],
    "_count": {
      "likes": 245,
      "bookmarks": 89,
      "comments": 34,
      "galleries": 12
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Status Codes:**

- `200` - Destination retrieved successfully
- `404` - Destination not found

---

### 4. Get Destination by Slug

Retrieves a specific destination by its slug.

**Endpoint:** `GET /api/destinations/:slug`

**Authentication:** Not required

**Path Parameters:**

- `slug`: Destination slug (string)

**Response:** Same as Get Destination by ID

**Status Codes:**

- `200` - Destination retrieved successfully
- `404` - Destination not found

---

### 5. Update Destination

Updates destination information.

**Endpoint:** `PUT /api/destinations/:id`

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id`: Destination ID (string)

**Request Body:**

| Field       | Type     | Required | Example                                        |
| ----------- | -------- | -------- | ---------------------------------------------- |
| name        | string   | No       | `"Borobudur Temple Complex"`                   |
| content     | string   | No       | `"Updated description..."`                     |
| address     | string   | No       | `"Updated address"`                            |
| mapUrl      | string   | No       | `"https://maps.google.com/updated"`            |
| latitude    | number   | No       | `-7.6079`                                      |
| longitude   | number   | No       | `110.2038`                                     |
| price       | number   | No       | `60000`                                        |
| coverId     | string   | No       | `"img_456"`                                    |
| districtId  | string   | No       | `"district_456"`                               |
| categoryId  | string   | No       | `"category_456"`                               |
| isPublished | boolean  | No       | `false`                                        |
| tags        | string[] | No       | `["temple", "buddhist", "heritage", "unesco"]` |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "dest_clh7x2y3z0000qwerty123"
  },
  "message": "Destination updated successfully"
}
```

**Status Codes:**

- `200` - Destination updated successfully
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `404` - Destination not found
- `409` - Slug already exists

---

### 6. Delete Destination

Deletes a destination.

**Endpoint:** `DELETE /api/destinations/:id`

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id`: Destination ID (string)

**Response:**

```json
{
  "success": true,
  "message": "Destination deleted successfully"
}
```

**Status Codes:**

- `200` - Destination deleted successfully
- `400` - Missing confirmation
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `404` - Destination not found

---

### 7. Toggle Destination Like

Likes or unlikes a destination.

**Endpoint:** `POST /api/destinations/:id/like`

**Authentication:** Required

**Path Parameters:**

- `id`: Destination ID (string)

**Response:**

```json
{
  "success": true,
  "data": {
    "liked": true,
    "likeCount": 246
  },
  "message": "Destination liked successfully"
}
```

**Status Codes:**

- `200` - Like toggled successfully
- `401` - Unauthorized
- `404` - Destination not found

---

### 8. Toggle Destination Bookmark

Bookmarks or unbookmarks a destination.

**Endpoint:** `POST /api/destinations/:id/bookmark`

**Authentication:** Required

**Path Parameters:**

- `id`: Destination ID (string)

**Response:**

```json
{
  "success": true,
  "data": {
    "bookmarked": true,
    "bookmarkCount": 90
  },
  "message": "Destination bookmarked successfully"
}
```

**Status Codes:**

- `200` - Bookmark toggled successfully
- `401` - Unauthorized
- `404` - Destination not found

---

### 9. Add Comment to Destination

Adds a comment to a destination.

**Endpoint:** `POST /api/destinations/:id/comments`

**Authentication:** Required

**Path Parameters:**

- `id`: Destination ID (string)

**Request Body:**

| Field    | Type   | Required | Example                                 |
| -------- | ------ | -------- | --------------------------------------- |
| body     | string | Yes      | `"This place is absolutely beautiful!"` |
| parentId | string | No       | `"comment_123"`                         |

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "comment_456",
    "body": "This place is absolutely beautiful!",
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
- `404` - Destination not found

---

### 10. Delete Comment to Destination

Delete a comment to a destination.

**Endpoint:** `DELETE /api/destinations/:destinationId/comments/:commentId`

**Authentication:** Required

**Path Parameters:**

- `destinationId`: Destination ID (string)
- `commentId`: Comment ID (string)

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "comment_456"
  },
  "message": "Comment deleted successfully"
}
```

**Status Codes:**

- `201` - Comment deleted successfully
- `401` - Unauthorized
- `404` - Destination not found
- `404` - Comment not found

---

### 11. Add Gallery Image

Adds an image to destination gallery.

**Endpoint:** `POST /api/destinations/:id/gallery`

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id`: Destination ID (string)

**Request Body:**

| Field   | Type   | Required | Example     |
| ------- | ------ | -------- | ----------- |
| imageId | string | Yes      | `"img_789"` |

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "gallery_456",
    "image": {
      "id": "img_789",
      "url": "https://example.com/gallery/image.jpg"
    }
  },
  "message": "Gallery image added successfully"
}
```

**Status Codes:**

- `201` - Gallery image added successfully
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `404` - Destination or image not found

---

### 12. Remove Gallery Image

Removes an image from destination gallery.

**Endpoint:** `DELETE /api/destinations/:id/gallery/:galleryId`

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id`: Destination ID (string)
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
- `404` - Destination or gallery image not found

---

## Data Models

### Destination Object

```json
{
  "id": "string", // Unique identifier (cuid)
  "name": "string", // Destination name
  "slug": "string", // URL-friendly slug (unique)
  "content": "string|null", // Destination description
  "address": "string|null", // Physical address
  "mapUrl": "string|null", // Google Maps or similar URL
  "latitude": "number|null", // GPS latitude
  "longitude": "number|null", // GPS longitude
  "price": "number", // Entry price (default: 0)
  "isPublished": "boolean", // Publication status (default: true)
  "coverId": "string|null", // Cover image ID
  "districtId": "string", // District ID (required)
  "categoryId": "string", // Category ID (required)
  "cover": "Image|null", // Cover image object
  "category": "Category", // Category object
  "district": "District", // District object
  "tags": "Tag[]", // Associated tags
  "galleries": "Gallery[]", // Gallery images
  "likes": "Like[]", // User likes
  "bookmarks": "Bookmark[]", // User bookmarks
  "comments": "Comment[]", // User comments
  "createdAt": "string", // ISO 8601 timestamp
  "updatedAt": "string" // ISO 8601 timestamp
}
```

### Category Object

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string|null",
  "destinations": "Destination[]",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### District Object

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string|null",
  "coverId": "string|null",
  "cover": "Image|null",
  "destinations": "Destination[]",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Tag Object

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "destinations": "Destination[]",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Gallery Object

```json
{
  "id": "string",
  "imageId": "string|null",
  "destinationId": "string|null",
  "traditionId": "string|null",
  "image": "Image|null",
  "destination": "Destination|null",
  "tradition": "Tradition|null",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Comment Object

```json
{
  "id": "string",
  "body": "string",
  "userId": "string",
  "destinationId": "string|null",
  "traditionId": "string|null",
  "storyId": "string|null",
  "parentId": "string|null",
  "author": "User",
  "destination": "Destination|null",
  "tradition": "Tradition|null",
  "story": "Story|null",
  "parent": "Comment|null",
  "replies": "Comment[]",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Bookmark Object

```json
{
  "id": "string",
  "userId": "string",
  "destinationId": "string|null",
  "traditionId": "string|null",
  "storyId": "string|null",
  "user": "User",
  "destination": "Destination|null",
  "tradition": "Tradition|null",
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

1. **Slug Uniqueness:** Destination slugs must be unique across all destinations
2. **Geolocation:** Latitude and longitude are stored as Float values
3. **Cascade Deletion:** When a destination is deleted, associated galleries, comments, likes, and bookmarks are also deleted
4. **Image Relations:** Cover images and gallery images are referenced through the Image model
5. **Tag System:** Tags are managed separately and linked through many-to-many relationships
6. **Comments System:** Supports nested comments through parent-child relationships
7. **Content Filtering:** Published/unpublished content can be filtered based on user permissions
8. **Price Format:** Prices are stored as integers (in smallest currency unit)
9. **Search Functionality:** Full-text search available on name and content fields
10. **Location Services:** Supports both address strings and precise GPS coordinates
