# API Documentation: Likes

This document covers all endpoints related to managing user likes. Likes are polymorphic and can be associated with Destinations, Traditions, or Stories.

## 👍 Data Model: Like

The `Like` object creates a link between a `User` and another model (`Destination`, `Tradition`, or `Story`) to signify appreciation.

| Field           | Type                | Description                              |
| :-------------- | :------------------ | :--------------------------------------- |
| `id`            | `String` (CUID)     | A unique identifier for the like entry.  |
| `userId`        | `String`            | The ID of the user who created the like. |
| `destinationId` | `String` (Optional) | The ID of the liked destination.         |
| `traditionId`   | `String` (Optional) | The ID of the liked tradition.           |
| `storyId`       | `String` (Optional) | The ID of the liked story.               |
| `createdAt`     | `DateTime`          | The timestamp when the like was created. |

---

## Endpoints

All like endpoints require user authentication.

### 👤 Authenticated User Endpoints

These endpoints require a **valid token** (the user must be logged in).

#### 1. Create a Like

Creates a like for a specific item (Destination, Tradition, or Story) for the authenticated user.

- **Method**: `POST`
- **Endpoint**: `/like`
- **Authentication**: **Required**

**Request Body**

| Field      | Type                                             | Required | Description                                    |
| :--------- | :----------------------------------------------- | :------- | :--------------------------------------------- |
| `schema`   | `enum` (`destinations`, `traditions`, `stories`) | Yes      | The type of content being liked.               |
| `schemaId` | `string` (CUID)                                  | Yes      | The unique ID of the content item to be liked. |

**Example Request Body:**

```json
{
  "schema": "stories",
  "schemaId": "clwhp5a1b000008l0b1c2d3e4"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Liked successfully",
  "result": {
    "id": "clwkaxzyw000008jp1234abcd"
  }
}
```

**Possible Errors:**

- `400 Bad Request`: If the user has already liked this item.
- `401 Unauthorized`: If the user is not authenticated.

---

#### 2. Delete a Like (Unlike)

Removes a like entry by its unique ID.

- **Method**: `DELETE`
- **Endpoint**: `/like/:id`
- **Authentication**: **Required**

**Path Parameters**

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | The unique CUID of the like entry. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Unliked successfully",
  "result": {
    "id": "clwkaxzyw000008jp1234abcd"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a like with the specified `id` does not exist.
- `401 Unauthorized`: If the user is not authenticated.
