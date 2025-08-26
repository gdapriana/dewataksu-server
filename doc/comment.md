# API Documentation: Comments

This document covers all endpoints related to managing user comments. Comments are polymorphic and can be associated with Destinations, Traditions, or Stories. They also support nested replies.

## 💬 Data Model: Comment

The `Comment` object has the following data structure, based on the Prisma schema:

| Field           | Type                | Description                                      |
| :-------------- | :------------------ | :----------------------------------------------- |
| `id`            | `String` (CUID)     | A unique identifier for the comment.             |
| `body`          | `String`            | The text content of the comment.                 |
| `userId`        | `String`            | The ID of the user who authored the comment.     |
| `destinationId` | `String` (Optional) | The ID of the commented-on destination.          |
| `traditionId`   | `String` (Optional) | The ID of the commented-on tradition.            |
| `storyId`       | `String` (Optional) | The ID of the commented-on story.                |
| `parentId`      | `String` (Optional) | The ID of the parent comment if this is a reply. |
| `createdAt`     | `DateTime`          | The timestamp when the comment was created.      |
| `updatedAt`     | `DateTime`          | The timestamp when the comment was last updated. |

---

## Endpoints

All comment endpoints require user authentication.

### 👤 Authenticated User Endpoints

These endpoints require a **valid token** (the user must be logged in).

#### 1. Create a Comment (or Reply)

Posts a new comment on a specific item (Destination, Tradition, or Story). Can also be used to reply to an existing comment.

- **Method**: `POST`
- **Endpoint**: `/comment`
- **Authentication**: **Required**

**Request Body**

| Field      | Type                                             | Required | Description                                      |
| :--------- | :----------------------------------------------- | :------- | :----------------------------------------------- |
| `body`     | `string`                                         | Yes      | The text of the comment, max 400 characters.     |
| `schema`   | `enum` (`destinations`, `traditions`, `stories`) | Yes      | The type of content being commented on.          |
| `schemaId` | `string` (CUID)                                  | Yes      | The unique ID of the content item.               |
| `parentId` | `string` (CUID)                                  | No       | The ID of the parent comment if this is a reply. |

**Example Request Body (Top-Level Comment):**

```json
{
  "body": "This is a great destination! Highly recommended.",
  "schema": "destinations",
  "schemaId": "clwjx1abc000008jp1234defg"
}
```

**Example Request Body (Reply to another comment):**

```json
{
  "body": "I agree! The view was breathtaking.",
  "schema": "destinations",
  "schemaId": "clwjx1abc000008jp1234defg",
  "parentId": "clwkb12345000108jphgfedcba"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Commented successfully",
  "result": {
    "id": "clwkb67890000208jpijklmno"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If the `schemaId` or `parentId` does not exist.
- `401 Unauthorized`: If the user is not authenticated.

---

#### 2. Delete a Comment

Removes a comment by its unique ID. The user must be the author of the comment to delete it.

- **Method**: `DELETE`
- **Endpoint**: `/comment/:id`
- **Authentication**: **Required**

**Path Parameters**

| Parameter | Type     | Description                               |
| :-------- | :------- | :---------------------------------------- |
| `id`      | `string` | The unique CUID of the comment to delete. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Uncommented successfully",
  "result": {
    "id": "clwkb67890000208jpijklmno"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a comment with the specified `id` does not exist.
- `403 Forbidden`: If the user is not the author of the comment.
- `401 Unauthorized`: If the user is not authenticated.
