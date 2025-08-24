# District API Documentation

## Overview

The District API provides endpoints for managing geographical districts that contain tourist destinations. Districts represent administrative regions or geographical areas that group related destinations together, such as "Ubud", "Canggu", "Seminyak", etc.

## Base URLs

```
/districts
```

## Authentication

- **Public endpoints:** No authentication required
- **Admin endpoints:** Require authentication and admin role via Bearer token

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Get District by Slug

Retrieves detailed information about a specific district including its destinations.

**Endpoint:** `GET /districts/:slug`

**Authentication:** Not required (Public)

**Path Parameters:**

- `slug`: District slug (string)

**Example Request:**

```
GET /districts/gianyar
```

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "district_clh7x2y3z0000qwerty123",
    "name": "Gianyar",
    "description": "Cultural heart of Bali known for its rice terraces, art villages, and spiritual retreats",
    "cover": {
      "url": "https://example.com/images/ubud-cover.jpg"
    },
    "_count": {
      "destinations": 15
    },
    "destinations": [
      {
        "id": "dest_clh7x2y3z0001qwerty456",
        "name": "Tegallalang Rice Terraces",
        "slug": "tegallalang-rice-terraces",
        "content": "Famous stepped rice terraces with stunning valley views",
        "address": "Jl. Raya Tegallalang, Tegallalang, Gianyar",
        "cover": {
          "url": "https://example.com/images/tegallalang.jpg"
        },
        "_count": {
          "likes": 234,
          "bookmarks": 89,
          "comments": 45
        }
      }
    ]
  },
  "message": "Get district successfully"
}
```

**Status Codes:**

- `200` - District retrieved successfully
- `404` - District not found

---

### 2. Get All Districts

Retrieves a paginated list of districts with search, sorting, and popularity filtering.

**Endpoint:** `GET /districts`

**Authentication:** Not required (Public)

**Query Parameters:**

| Parameter | Type   | Required | Default       | Example     | Description                                                |
| --------- | ------ | -------- | ------------- | ----------- | ---------------------------------------------------------- |
| search    | string | No       | -             | `"ubud"`    | Search districts by name or description (case-insensitive) |
| page      | number | No       | 1             | `2`         | Page number (positive integer)                             |
| limit     | number | No       | 10            | `20`        | Items per page (positive integer)                          |
| sortBy    | string | No       | `"createdAt"` | `"popular"` | Sort field: "popular", "createdAt", "updatedAt"            |
| orderBy   | string | No       | `"desc"`      | `"asc"`     | Sort order: "asc", "desc"                                  |

**Example Request:**

```
GET /districts?page=1&limit=20&search=bali&sortBy=popular&orderBy=desc
```

**Response:**

```json
{
  "success": true,
  "result": {
    "districts": [
      {
        "id": "district_clh7x2y3z0000qwerty123",
        "name": "Ubud",
        "slug": "ubud",
        "description": "Cultural heart of Bali known for its rice terraces and art villages",
        "cover": {
          "url": "https://example.com/images/ubud-cover.jpg"
        },
        "_count": {
          "destinations": 15
        }
      },
      {
        "id": "district_clh7x2y3z0001qwerty456",
        "name": "Canggu",
        "slug": "canggu",
        "description": "Beach town popular with surfers and digital nomads",
        "cover": {
          "url": "https://example.com/images/canggu-cover.jpg"
        },
        "_count": {
          "destinations": 12
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "pages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Gets districts successfully"
}
```

**Status Codes:**

- `200` - Districts retrieved successfully
- `400` - Invalid query parameters

---

### 3. Create District

Creates a new district.

**Endpoint:** `POST /districts`

**Authentication:** Required (Admin role)

**Request Body:**

| Field       | Type   | Required | Min | Max | Example                                              | Description                    |
| ----------- | ------ | -------- | --- | --- | ---------------------------------------------------- | ------------------------------ |
| name        | string | Yes      | 2   | 100 | `"Seminyak"`                                         | District name (trimmed)        |
| description | string | No       | 10  | 400 | `"Upscale beach area with luxury resorts and clubs"` | District description (trimmed) |
| coverId     | string | No       | -   | -   | `"img_789"`                                          | Cover image ID (CUID format)   |

**Example Request:**

```json
{
  "name": "Seminyak",
  "description": "Upscale beach area known for luxury resorts, fine dining, and vibrant nightlife",
  "coverId": "img_clh7x2y3z0002qwerty789"
}
```

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "district_clh7x2y3z0003qwerty012"
  },
  "message": "Create district successfully"
}
```

**Status Codes:**

- `200` - District created successfully
- `400` - Validation error (invalid name length, description length, invalid coverId format)
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `409` - Conflict (district name/slug already exists)

---

### 4. Update District

Updates an existing district.

**Endpoint:** `PATCH /districts/:id`

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id`: District ID (string, CUID format)

**Request Body:**

| Field       | Type         | Required | Min | Max  | Example                                                | Description                       |
| ----------- | ------------ | -------- | --- | ---- | ------------------------------------------------------ | --------------------------------- |
| name        | string       | No       | 2   | 100  | `"Seminyak Beach"`                                     | Updated district name             |
| description | string\|null | No       | 10  | 2000 | `"Updated description with more detailed information"` | Updated description (nullable)    |
| coverId     | string\|null | No       | -   | -    | `"img_456"` or `null`                                  | Updated cover image ID (nullable) |

**Example Request:**

```json
{
  "name": "Seminyak Beach Area",
  "description": "Premium beachfront destination featuring world-class resorts, gourmet restaurants, and exclusive beach clubs with stunning sunset views",
  "coverId": "img_clh7x2y3z0004qwerty345"
}
```

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "district_clh7x2y3z0003qwerty012"
  },
  "message": "Update district successfully"
}
```

**Status Codes:**

- `200` - District updated successfully
- `400` - Validation error or invalid district ID format
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `404` - District not found
- `409` - Conflict (district name/slug already exists)

---

### 5. Delete District

Deletes a district.

**Endpoint:** `DELETE /districts/:id`

**Authentication:** Required (Admin role)

**Path Parameters:**

- `id`: District ID (string, CUID format)

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "district_clh7x2y3z0003qwerty012"
  },
  "message": "Delete district successfully"
}
```

**Status Codes:**

- `200` - District deleted successfully
- `400` - Invalid district ID format
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `404` - District not found
- `409` - Cannot delete district with associated destinations

---

## Data Models

### District Object (Detailed)

```json
{
  "id": "string", // Unique identifier (cuid)
  "name": "string", // District name (2-100 characters)
  "slug": "string", // URL-friendly slug (unique, auto-generated)
  "description": "string|null", // District description (10-400/2000 characters)
  "coverId": "string|null", // Cover image ID reference
  "cover": {
    "url": "string" // Cover image URL
  },
  "destinations": "Destination[]", // Associated destinations
  "_count": {
    "destinations": "number" // Count of destinations in district
  },
  "createdAt": "string", // ISO 8601 timestamp
  "updatedAt": "string" // ISO 8601 timestamp
}
```

### District List Response

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string|null",
  "cover": {
    "url": "string"
  },
  "_count": {
    "destinations": "number"
  }
}
```

### Destination Object (in District Response)

```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "content": "string|null",
  "address": "string|null",
  "cover": {
    "url": "string"
  },
  "_count": {
    "likes": "number",
    "bookmarks": "number",
    "comments": "number"
  }
}
```

---

## Validation Rules

### Query Parameters (GET All)

- **search**: Optional string for searching name and description
- **page**: Positive integer, defaults to 1
- **limit**: Positive integer, defaults to 10
- **sortBy**: Enum ["popular", "createdAt", "updatedAt"], defaults to "createdAt"
- **orderBy**: Enum ["asc", "desc"], defaults to "desc"

### District Creation (POST)

- **name**: Required string, 2-100 characters, whitespace trimmed
- **description**: Optional string, 10-400 characters, whitespace trimmed
- **coverId**: Optional CUID format string, whitespace trimmed

### District Update (PATCH)

- **name**: Optional string, 2-100 characters, whitespace trimmed
- **description**: Optional nullable string, 10-2000 characters, whitespace trimmed
- **coverId**: Optional nullable CUID format string, whitespace trimmed

### District Retrieval/Deletion

- **slug**: String for GET by slug
- **id**: CUID format string for DELETE

---

## Business Logic

### Slug Generation

- Slugs are automatically generated from district names using slugify
- Slugs are unique across all districts
- Slug conflicts result in a 409 error response
- When updating district name, a new slug is generated and checked for uniqueness

### Popular Sorting

- When `sortBy=popular`, districts are sorted by their destination count
- Uses relationship count to determine popularity
- Can be combined with ascending/descending order

### Activity Logging

All administrative actions (CREATE, UPDATE, DELETE) are logged in the activity log with:

- Action type (CREATE/UPDATE/DELETE)
- Schema type (DISTRICT)
- Schema ID (district ID)
- User ID (admin who performed the action)

### Image Relations

- Districts can have optional cover images referenced by `coverId`
- Cover image deletion cascades to remove the reference
- Nullable coverId allows removing cover images by setting to null

### Cascade Behavior

- Districts can only be deleted if they have no associated destinations
- Attempting to delete a district with destinations will result in a 409 error

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
- `NOT_FOUND` - District not found
- `ALREADY_EXISTS` - District name/slug already exists
- `CONFLICT` - Cannot delete district with associated destinations
- `INVALID_CUID` - Invalid CUID format provided
- `INTERNAL_ERROR` - Server error

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

### Get District by Slug

```bash
curl -X GET "/districts/ubud"
```

### Get Districts with Popular Sorting

```bash
curl -X GET "/districts?page=1&limit=10&sortBy=popular&orderBy=desc"
```

### Search Districts

```bash
curl -X GET "/districts?search=beach&page=1&limit=20"
```

### Create a New District

```bash
curl -X POST /districts \
  -H "Authorization: Bearer your_admin_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nusa Dua",
    "description": "Premium resort area with pristine beaches and luxury accommodations",
    "coverId": "img_clh7x2y3z0005qwerty678"
  }'
```

### Update a District

```bash
curl -X PATCH /districts/district_clh7x2y3z0003qwerty012 \
  -H "Authorization: Bearer your_admin_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description with more comprehensive information about the area",
    "coverId": null
  }'
```

### Delete a District

```bash
curl -X DELETE /districts/district_clh7x2y3z0003qwerty012 \
  -H "Authorization: Bearer your_admin_jwt_token"
```

---

## Notes

1. **Slug-Based Retrieval**: Individual districts are accessed by slug for SEO-friendly URLs
2. **Popular Sorting**: Special sorting by destination count for discovering trending areas
3. **Comprehensive Search**: Search functionality covers both name and description fields
4. **Image Management**: Support for cover images with nullable references
5. **Activity Logging**: All admin operations are logged for audit purposes
6. **Cascade Protection**: Districts with destinations cannot be deleted
7. **Flexible Description**: Creation allows 400 chars, updates allow 2000 chars for more detailed content
8. **CUID Format**: All IDs use CUID format for better performance
9. **Rich Destination Data**: District details include full destination information with counts
10. **Pagination**: Configurable pagination with sensible defaults (10 items per page)
