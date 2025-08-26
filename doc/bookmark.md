# API Documentation: Bookmarks

This document covers all endpoints related to managing user bookmarks. Bookmarks are polymorphic and can be associated with Destinations, Traditions, or Stories.

## 🔖 Data Model: Bookmark

The `Bookmark` object creates a link between a `User` and another model (`Destination`, `Tradition`, or `Story`).

| Field           | Type                | Description                                  |
| :-------------- | :------------------ | :------------------------------------------- |
| `id`            | `String` (CUID)     | A unique identifier for the bookmark entry.  |
| `userId`        | `String`            | The ID of the user who created the bookmark. |
| `destinationId` | `String` (Optional) | The ID of the bookmarked destination.        |
| `traditionId`   | `String` (Optional) | The ID of the bookmarked tradition.          |
| `storyId`       | `String` (Optional) | The ID of the bookmarked story.              |
| `createdAt`     | `DateTime`          | The timestamp when the bookmark was created. |

---

## Endpoints

All bookmark endpoints require user authentication.

### 👤 Authenticated User Endpoints

These endpoints require a **valid token** (the user must be logged in).

#### 1. Create a Bookmark

Creates a bookmark for a specific item (Destination, Tradition, or Story) for the authenticated user.

- **Method**: `POST`
- **Endpoint**: `/bookmark`
- **Authentication**: **Required**

**Request Body**

| Field      | Type                                             | Required | Description                                         |
| :--------- | :----------------------------------------------- | :------- | :-------------------------------------------------- |
| `schema`   | `enum` (`destinations`, `traditions`, `stories`) | Yes      | The type of content being bookmarked.               |
| `schemaId` | `string` (CUID)                                  | Yes      | The unique ID of the content item to be bookmarked. |

**Example Request Body:**

```json
{
  "schema": "destinations",
  "schemaId": "clwjx1abc000008jp1234defg"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Bookmarked successfully",
  "result": {
    "id": "clwk9pqrst000008jpuvwxyz12"
  }
}
```

**Possible Errors:**

- `400 Bad Request`: If the user has already bookmarked this item.
- `401 Unauthorized`: If the user is not authenticated.

---

#### 2. Delete a Bookmark

Removes a bookmark entry by its unique ID.

- **Method**: `DELETE`
- **Endpoint**: `/bookmark/:id`
- **Authentication**: **Required**

**Path Parameters**

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | The unique CUID of the bookmark entry. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Unbookmarked successfully",
  "result": {
    "id": "clwk9pqrst000008jpuvwxyz12"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a bookmark with the specified `id` does not exist.
- `401 Unauthorized`: If the user is not authenticated.
