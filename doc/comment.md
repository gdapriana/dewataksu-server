# Comment API Documentation

## Overview

The Comment API provides endpoints for managing comments on various content types including destinations, traditions, and stories. It supports nested comments through parent-child relationships and user-based comment management.

## Base URL

```
/comment
```

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Create Comment

Creates a new comment on a destination, tradition, or story.

**Endpoint:** `POST /comment`

**Authentication:** Required

**Request Body:**

| Field    | Type   | Required | Example                                 | Description                                           |
| -------- | ------ | -------- | --------------------------------------- | ----------------------------------------------------- |
| body     | string | Yes      | `"This place is absolutely beautiful!"` | Comment content (1-400 characters)                    |
| schemaId | string | Yes      | `"dest_clh7x2y3z0000qwerty123"`         | ID of the content being commented on (CUID)           |
| schema   | string | Yes      | `"destinations"`                        | Content type: "destinations", "traditions", "stories" |
| parentId | string | No       | `"comment_123"`                         | Parent comment ID for nested replies (CUID)           |

**Example Request:**

```json
{
  "body": "Amazing place! Would definitely visit again.",
  "schemaId": "dest_clh7x2y3z0000qwerty123",
  "schema": "destinations",
  "parentId": null
}
```

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "comment_clh7x2y3z0001qwerty456"
  },
  "message": "Comment successfully"
}
```

**Status Codes:**

- `200` - Comment created successfully
- `400` - Validation error (invalid body length, invalid schema, invalid CUID format)
- `401` - Unauthorized (authentication required)
- `404` - Schema not found (destination/tradition/story doesn't exist)
- `404` - Parent comment not found (when parentId is provided)

---

### 2. Delete Comment

Deletes a comment. Users can only delete their own comments.

**Endpoint:** `DELETE /comment/:id`

**Authentication:** Required

**Path Parameters:**

- `id`: Comment ID (string, CUID format)

**Response:**

```json
{
  "success": true,
  "result": {
    "id": "comment_clh7x2y3z0001qwerty456"
  },
  "message": "Uncomment successfully"
}
```

**Status Codes:**

- `200` - Comment deleted successfully
- `400` - Invalid comment ID format
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (user can only delete their own comments)
- `404` - Comment not found

---

## Data Models

### Comment Object

```json
{
  "id": "string", // Unique identifier (cuid)
  "body": "string", // Comment content (1-400 characters)
  "userId": "string", // Author user ID
  "destinationId": "string|null", // Associated destination ID
  "traditionId": "string|null", // Associated tradition ID
  "storyId": "string|null", // Associated story ID
  "parentId": "string|null", // Parent comment ID for nested replies
  "author": "User", // Author user object
  "destination": "Destination|null", // Associated destination object
  "tradition": "Tradition|null", // Associated tradition object
  "story": "Story|null", // Associated story object
  "parent": "Comment|null", // Parent comment object
  "replies": "Comment[]", // Child comments (replies)
  "createdAt": "string", // ISO 8601 timestamp
  "updatedAt": "string" // ISO 8601 timestamp
}
```

---

## Validation Rules

### Comment Creation

- **body**: Required string, 1-400 characters, whitespace trimmed
- **schemaId**: Required CUID format string
- **schema**: Required enum value: "destinations", "traditions", or "stories"
- **parentId**: Optional CUID format string or null

### Comment Deletion

- **id**: Required CUID format string

---

## Business Logic

### Comment Creation

1. **Schema Validation**: The API validates that the referenced content (destination, tradition, or story) exists
2. **Parent Validation**: If `parentId` is provided, validates that the parent comment exists
3. **Content Association**: Comments are linked to the appropriate content type based on the `schema` parameter
4. **Nested Comments**: Comments can be replies to other comments through the `parentId` relationship

### Comment Deletion

1. **Ownership Check**: Users can only delete their own comments
2. **Cascade Deletion**: When a comment is deleted, all its replies are also deleted (handled by database cascade)
3. **Authorization**: Proper authentication and ownership validation is enforced

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
- `FORBIDDEN` - User can only delete their own comments
- `NOT_FOUND` - Comment, destination, tradition, story, or parent comment not found
- `INVALID_CUID` - Invalid CUID format provided
- `INTERNAL_ERROR` - Server error

### Validation Error Examples

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Comment body must be between 1 and 400 characters"
  }
}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Schema must be one of: destinations, traditions, stories"
  }
}
```

---

## Rate Limiting

The API implements rate limiting for comment operations:

- **Comment creation:** 30 requests per hour per user
- **Comment deletion:** 50 requests per hour per user

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

### Creating a Comment on a Destination

```bash
curl -X POST /api/comment \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "body": "Beautiful temple with rich history!",
    "schemaId": "dest_clh7x2y3z0000qwerty123",
    "schema": "destinations"
  }'
```

### Creating a Reply to a Comment

```bash
curl -X POST /api/comment \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "body": "I completely agree! The architecture is stunning.",
    "schemaId": "dest_clh7x2y3z0000qwerty123",
    "schema": "destinations",
    "parentId": "comment_clh7x2y3z0001qwerty456"
  }'
```

### Deleting a Comment

```bash
curl -X DELETE /api/comment/comment_clh7x2y3z0001qwerty456 \
  -H "Authorization: Bearer your_jwt_token"
```

---

## Notes

1. **Multi-Content Support**: Comments can be associated with destinations, traditions, or stories
2. **Nested Comments**: Supports unlimited nesting depth through parent-child relationships
3. **Cascade Deletion**: Deleting a parent comment automatically deletes all its replies
4. **Ownership Control**: Users can only delete comments they created
5. **Content Length**: Comment body is limited to 400 characters to ensure readability
6. **CUID Format**: All IDs use CUID format for better performance and uniqueness
7. **Real-time Updates**: Consider implementing WebSocket connections for real-time comment updates
8. **Moderation**: Consider implementing comment moderation features for content management
9. **Pagination**: For high-traffic content, consider implementing pagination for comment retrieval
10. **Soft Delete**: Consider implementing soft delete for comments to preserve conversation context
