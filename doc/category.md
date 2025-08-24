# Category API Documentation

## Overview

The Category API provides endpoints for managing destination categories. It includes functionality for creating, retrieving, updating, and deleting categories. Categories are used to organize destinations into logical groups like "Historical Sites", "Natural Wonders", "Cultural Attractions", etc.

## Base URLs

```
/categories
```

## Authentication

- **Public endpoints:** No authentication required
- **Admin endpoints:** Require authentication and admin role via Bearer token

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Get All Categories

Retrieves a paginated list of categories with search and sorting capabilities.

**Endpoint:** `GET /categories`

**Authentication:** Not required (Public)

**Query Parameters:**

| Parameter | Type   | Required | Default       | Example        | Description                                  |
| --------- | ------ | -------- | ------------- | -------------- | -------------------------------------------- |
| search    | string | No       | -             | `"historical"` | Search categories by name (case-insensitive) |
| page      | number | No       | 1             | `2`            | Page number (positive integer)               |
| limit     | number | No       | 100           | `50`           | Items per page (positive integer)            |
| sortBy    | string | No       | `"createdAt"` | `"updatedAt"`  | Sort field: "createdAt", "updatedAt"         |
| orderBy   | string | No       | `"desc"`      | `"asc"`        | Sort order: "asc", "desc"                    |

**Example Request:**

```
GET /api/categories?page=1&limit=20&search=temple&sortBy=createdAt&orderBy=desc
```

**Response:**

```json
{
  "success": true,
  "result": {
    "categories": [
      {
        "id": "category_clh7x2y3z0000qwerty123",
        "name": "Historical Sites",
        "slug": "historical-sites",
        "_count": {
          "destinations": 25
        }
      },
      {
        "id": "category_clh7x2y3z0001qwerty456",
        "name": "Natural Wonders",
        "slug": "natural-wonders",
        "_count": {
          "destinations": 18
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "pages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  },
  "message": "Gets categories successfully"
}
```

**Status Codes:**

- `200` - Categories retrieved successfully
- `400` - Invalid query parameters

---

### 2. Create Category

Creates a new category.

**Endpoint:** `POST /categories`

**Authentication:** Required (Admin role)

**Request Body:**

| Field       | Type   | Required | Min | Max | Example                                           | Description                    |
| ----------- | ------ | -------- | --- | --- | ------------------------------------------------- | ------------------------------ |
| name        | string | Yes      | 2   | 100 | `"Cultural Heritage"`                             | Category name (trimmed)        |
| description | string | No       | 10  | 400 | `"Sites showcasing local culture and traditions"` | Category description (trimmed) |

**Example Request:**

```json
{
  "name": "Cultural Heritage",
  "description": "Sites showcasing local culture and traditions from various regions"
}
```

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "category_clh7x2y3z0002qwerty789"
  },
  "message": "Create category successfully"
}
```

**Status Codes:**

- `200` - Category created successfully
- `400` - Validation error (invalid name length, description length)
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `409` - Conflict (category name/slug already exists)

---

### 3. Update Category

Updates an existing category.

**Endpoint:** `PATCH /categories/:id`

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id`: Category ID (string, CUID format)

**Request Body:**

| Field       | Type   | Required | Min | Max | Example                                             | Description                  |
| ----------- | ------ | -------- | --- | --- | --------------------------------------------------- | ---------------------------- |
| name        | string | No       | 2   | 100 | `"Cultural & Historical Heritage"`                  | Updated category name        |
| description | string | No       | 10  | 400 | `"Updated description for cultural heritage sites"` | Updated category description |

**Example Request:**

```json
{
  "name": "Cultural & Historical Heritage",
  "description": "Sites showcasing local culture, traditions, and historical significance"
}
```

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "category_clh7x2y3z0002qwerty789"
  },
  "message": "Update category successfully"
}
```

**Status Codes:**

- `200` - Category updated successfully
- `400` - Validation error or invalid category ID format
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `404` - Category not found
- `409` - Conflict (category name/slug already exists)

---

### 4. Delete Category

Deletes a category.

**Endpoint:** `DELETE /categories/:id`

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id`: Category ID (string, CUID format)

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "category_clh7x2y3z0002qwerty789"
  },
  "message": "Delete category successfully"
}
```

**Status Codes:**

- `200` - Category deleted successfully
- `400` - Invalid category ID format
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `404` - Category not found
- `409` - Cannot delete category with associated destinations

---

## Data Models

### Category Object

```json
{
  "id": "string", // Unique identifier (cuid)
  "name": "string", // Category name (2-100 characters)
  "slug": "string", // URL-friendly slug (unique, auto-generated)
  "description": "string|null", // Category description (10-400 characters)
  "destinations": "Destination[]", // Associated destinations
  "_count": {
    "destinations": "number" // Count of associated destinations
  },
  "createdAt": "string", // ISO 8601 timestamp
  "updatedAt": "string" // ISO 8601 timestamp
}
```

### Category Response (Get All)

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "_count": {
    "destinations": "number"
  }
}
```

---

## Validation Rules

### Query Parameters (GET)

- **search**: Optional string for name searching
- **page**: Positive integer, defaults to 1
- **limit**: Positive integer, defaults to 100
- **sortBy**: Enum ["createdAt", "updatedAt"], defaults to "createdAt"
- **orderBy**: Enum ["asc", "desc"], defaults to "desc"

### Category Creation (POST)

- **name**: Required string, 2-100 characters, whitespace trimmed
- **description**: Optional string, 10-400 characters, whitespace trimmed

### Category Update (PATCH)

- **name**: Optional string, 2-100 characters, whitespace trimmed
- **description**: Optional string, 10-400 characters, whitespace trimmed

### Category Deletion (DELETE)

- **id**: Required CUID format string

---

## Business Logic

### Slug Generation

- Slugs are automatically generated from category names using slugify
- Slugs are unique across all categories
- Slug conflicts result in a 409 error response
- When updating category name, a new slug is generated and checked for uniqueness

### Activity Logging

All administrative actions (CREATE, UPDATE, DELETE) are logged in the activity log with:

- Action type (CREATE/UPDATE/DELETE)
- Schema type (CATEGORY)
- Schema ID (category ID)
- User ID (admin who performed the action)

### Cascade Behavior

- Categories can only be deleted if they have no associated destinations
- Attempting to delete a category with destinations will result in a 409 error

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
- `FORBIDDEN` - Admin access required
- `NOT_FOUND` - Category not found
- `ALREADY_EXISTS` - Category name/slug already exists
- `CONFLICT` - Cannot delete category with associated destinations
- `INVALID_CUID` - Invalid CUID format provided
- `INTERNAL_ERROR` - Server error

### Validation Error Examples

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name must be at least 2 characters long."
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Page must be a positive integer"
  }
}
```

---

## Rate Limiting

The API implements rate limiting:

- **Public endpoints:** 200 requests per minute per IP
- **Admin endpoints:** 100 requests per minute per user

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

## Usage Examples

### Get Categories with Search

```bash
curl -X GET "/api/categories?search=historical&page=1&limit=10&sortBy=createdAt&orderBy=desc"
```

### Create a New Category

```bash
curl -X POST /categories \
  -H "Authorization: Bearer your_admin_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Adventure Sports",
    "description": "Categories for adventure and extreme sports activities"
  }'
```

### Update a Category

```bash
curl -X PATCH /categories/category_clh7x2y3z0002qwerty789 \
  -H "Authorization: Bearer your_admin_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Adventure & Extreme Sports",
    "description": "Updated description for adventure sports and extreme activities"
  }'
```

### Delete a Category

```bash
curl -X DELETE /categories/category_clh7x2y3z0002qwerty789 \
  -H "Authorization: Bearer your_admin_jwt_token"
```

---

## Notes

1. **Slug Uniqueness**: Category slugs are automatically generated and must be unique
2. **Admin Access**: All CUD operations require admin authentication
3. **Activity Logging**: All admin operations are logged for audit purposes
4. **Search Functionality**: Case-insensitive search available on category names
5. **Pagination**: Default limit is 100 items, supports custom pagination
6. **Cascade Protection**: Categories with destinations cannot be deleted
7. **CUID Format**: All IDs use CUID format for better performance
8. **Input Sanitization**: All string inputs are trimmed of whitespace
9. **Sorting Options**: Supports sorting by creation and update timestamps
10. **Content Validation**: Names have 2-100 character limits, descriptions 10-400 characters
