# Like API Documentation

## Overview

The Like API provides endpoints for managing user likes on various content types including destinations, traditions, and stories. Users can like and unlike content, with proper validation to prevent duplicate likes.

## Base URL

```
/like
```

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Like Content

Creates a new like for a specific content item (destination, tradition, or story).

**Endpoint:** `POST /like`

**Authentication:** Required

**Request Body:**

| Field    | Type   | Required | Description                    | Example                    |
| -------- | ------ | -------- | ------------------------------ | -------------------------- |
| schema   | string | Yes      | Type of content to like        | `"destinations"`           |
| schemaId | string | Yes      | ID of the content item to like | `"clh7x2y3z0000qwerty123"` |

**Valid Schema Values:**

- `"destinations"` - For liking destinations
- `"traditions"` - For liking traditions
- `"stories"` - For liking stories

**Example Request:**

```json
{
  "schema": "destinations",
  "schemaId": "clh7x2y3z0000qwerty123"
}
```

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "clh7x2y3z0000like123"
  },
  "message": "Like successfully"
}
```

**Status Codes:**

- `200` - Content liked successfully
- `400` - Validation error or missing required fields
- `401` - Unauthorized (authentication required)
- `409` - Conflict (user has already liked this content)

---

### 2. Unlike Content

Removes a like from a specific content item.

**Endpoint:** `DELETE /like/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Like ID (string, cuid format)

**Example Request:**

```
DELETE /like/clh7x2y3z0000like123
```

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "clh7x2y3z0000like123"
  },
  "message": "Unlike successfully"
}
```

**Status Codes:**

- `200` - Content unliked successfully
- `400` - Invalid like ID format
- `401` - Unauthorized (authentication required)
- `404` - Like not found

---

## Data Models

### Like Object

```json
{
  "id": "string", // Unique identifier (cuid)
  "userId": "string", // ID of the user who liked the content
  "destinationId": "string|null", // ID of liked destination (if applicable)
  "traditionId": "string|null", // ID of liked tradition (if applicable)
  "storyId": "string|null", // ID of liked story (if applicable)
  "createdAt": "string" // ISO 8601 timestamp when like was created
}
```

### Request/Response Examples

#### Like a Destination

**Request:**

```json
{
  "schema": "destinations",
  "schemaId": "dest_abc123xyz789"
}
```

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "like_def456uvw012"
  },
  "message": "Like successfully"
}
```

#### Like a Tradition

**Request:**

```json
{
  "schema": "traditions",
  "schemaId": "trad_ghi789rst345"
}
```

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "like_jkl012mno678"
  },
  "message": "Like successfully"
}
```

#### Like a Story

**Request:**

```json
{
  "schema": "stories",
  "schemaId": "story_pqr345stu901"
}
```

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "like_vwx678yza234"
  },
  "message": "Like successfully"
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

### Common Error Scenarios

#### 1. Duplicate Like Attempt

When trying to like content that's already been liked by the user:

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_EXISTS",
    "message": "Like already exists"
  }
}
```

#### 2. Invalid Schema Type

When providing an invalid schema value:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid schema. Must be one of: destinations, traditions, stories"
  }
}
```

#### 3. Invalid ID Format

When providing an invalid cuid format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid ID format. Expected cuid."
  }
}
```

#### 4. Like Not Found

When trying to unlike a non-existent like:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Like not found"
  }
}
```

---

## Business Rules

### Unique Constraints

The system enforces unique constraints to prevent duplicate likes:

- A user can only like a specific destination once: `@@unique([userId, destinationId])`
- A user can only like a specific tradition once: `@@unique([userId, traditionId])`
- A user can only like a specific story once: `@@unique([userId, storyId])`

### Content Type Validation

- Only one content type can be liked per request (destination, tradition, or story)
- Each like record will have exactly one of: `destinationId`, `traditionId`, or `storyId` set (the others will be null)

### Authorization

- Users can only create likes for their own account (userId is automatically set from the authenticated user)
- Users can unlike any like record by providing the like ID

---

## Usage Examples

### Complete Like/Unlike Flow

1. **Like a destination:**

   ```bash
   curl -X POST /like \
     -H "Authorization: Bearer your_jwt_token" \
     -H "Content-Type: application/json" \
     -d '{
       "schema": "destinations",
       "schemaId": "dest_123abc456def"
     }'
   ```

2. **Unlike the destination:**
   ```bash
   curl -X DELETE /like/like_789ghi012jkl \
     -H "Authorization: Bearer your_jwt_token"
   ```

## Notes

1. **Cascade Deletion:** When a user or content item (destination/tradition/story) is deleted, all associated likes are automatically removed
2. **User Context:** The `userId` is automatically extracted from the authenticated user's JWT token - it should not be included in the request body
3. **Content Validation:** The API does not validate if the referenced content (destination/tradition/story) actually exists - this should be handled at the application level
4. **Rate Limiting:** Standard rate limiting applies as defined in the main API documentation
5. **Activity Logging:** Like/unlike actions may generate activity log entries for the user
