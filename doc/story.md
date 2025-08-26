# API Documentation: Stories

This document covers all endpoints related to managing user-created stories.

## 📖 Data Model: Story

The `Story` object has the following data structure, based on the Prisma schema:

| Field         | Type                | Description                                      |
| :------------ | :------------------ | :----------------------------------------------- |
| `id`          | `String` (CUID)     | A unique identifier for the story.               |
| `name`        | `String`            | The title of the story.                          |
| `slug`        | `String`            | A unique, URL-friendly version of the name.      |
| `content`     | `String`            | The main content of the story.                   |
| `isPublished` | `Boolean`           | Indicates if the story is visible to the public. |
| `coverId`     | `String` (Optional) | The ID of the linked cover image.                |
| `userId`      | `String`            | The ID of the user who authored the story.       |
| `createdAt`   | `DateTime`          | The timestamp when the story was created.        |
| `updatedAt`   | `DateTime`          | The timestamp when the story was last updated.   |

---

## Endpoints

Endpoints are divided into two categories: **Public** and **Authenticated User**.

### 🌐 Public Endpoints

These endpoints can be accessed without authentication.

#### 1. Get a List of Stories

Retrieves a list of all published stories with filtering, sorting, and pagination.

- **Method**: `GET`
- **Endpoint**: `/stories`

**Query Parameters**

| Parameter     | Type     | Description                                                 | Default     |
| :------------ | :------- | :---------------------------------------------------------- | :---------- |
| `page`        | `number` | The current page number.                                    | `1`         |
| `limit`       | `number` | The number of items per page.                               | `10`        |
| `search`      | `string` | Search by `name` or `content`.                              | -           |
| `isPublished` | `string` | Filter by publication status (`1` for true, `0` for false). | -           |
| `sortBy`      | `string` | Sort by (`createdAt`, `updatedAt`, `bookmarked`, `liked`).  | `createdAt` |
| `orderBy`     | `string` | Sort direction (`asc` or `desc`).                           | `desc`      |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "gets story successfully",
  "result": {
    "stories": [
      {
        "id": "clwhp5a1b000008l0b1c2d3e4",
        "name": "My First Adventure",
        "slug": "my-first-adventure",
        "content": "This is the beginning of a great story...",
        "isPublished": true,
        "cover": {
          "id": "clwhp5fgh000108l0ijklmno",
          "url": "[https://example.com/images/adventure.jpg](https://example.com/images/adventure.jpg)",
          "publicId": "folder/adventure"
        },
        "_count": {
          "likes": 25,
          "bookmarks": 10,
          "comments": 5
        }
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

#### 2. Get a Single Story by Slug

Retrieves the full details of a single story by its unique `slug`.

- **Method**: `GET`
- **Endpoint**: `/stories/:slug`

**Path Parameters**

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `slug`    | `string` | The unique slug of the story. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "get story successfully",
  "result": {
    "id": "clwhp5a1b000008l0b1c2d3e4",
    "name": "My First Adventure",
    "slug": "my-first-adventure",
    "content": "This is the beginning of a great story...",
    "isPublished": true,
    "coverId": "clwhp5fgh000108l0ijklmno",
    "userId": "clwdb9xkb000008l430s1h1g1",
    "createdAt": "2025-08-29T08:00:00.000Z",
    "updatedAt": "2025-08-29T08:00:00.000Z",
    "cover": {
      "id": "clwhp5fgh000108l0ijklmno",
      "url": "[https://example.com/images/adventure.jpg](https://example.com/images/adventure.jpg)",
      "publicId": "folder/adventure"
    },
    "comments": [],
    "_count": {
      "likes": 25,
      "bookmarks": 10,
      "comments": 5
    }
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a story with the specified `slug` is not found.

---

### 👤 Authenticated User Endpoints

These endpoints require a **valid token** (the user must be logged in).

#### 1. Create a New Story

Posts a new story, linking it to the authenticated user.

- **Method**: `POST`
- **Endpoint**: `/stories`
- **Authentication**: **Required**

**Request Body**

| Field         | Type      | Required | Description                                      |
| :------------ | :-------- | :------- | :----------------------------------------------- |
| `name`        | `string`  | Yes      | The title of the story.                          |
| `content`     | `string`  | Yes      | The main content of the story.                   |
| `coverId`     | `string`  | No       | The CUID of the cover image.                     |
| `isPublished` | `boolean` | No       | Sets the publication status. Defaults to `true`. |

**Example Request Body:**

```json
{
  "name": "A Journey to the Mountains",
  "content": "The journey began on a cold morning...",
  "coverId": "clwhp6xyz000208l0pqrstuvw",
  "isPublished": true
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "create story successfully",
  "result": {
    "id": "clwhp7abc000308l0defghij"
  }
}
```

**Possible Errors:**

- `400 Bad Request`: If validation fails or a story with the same name (and slug) already exists.

---

#### 2. Update a Story

Updates the details of an existing story by its ID. The user must be the author of the story.

- **Method**: `PATCH`
- **Endpoint**: `/stories/:id`
- **Authentication**: **Required**

**Path Parameters**

| Parameter | Type     | Description                      |
| :-------- | :------- | :------------------------------- |
| `id`      | `string` | The CUID of the story to update. |

**Request Body**

| Field         | Type      | Required | Description                                      |
| :------------ | :-------- | :------- | :----------------------------------------------- |
| `name`        | `string`  | No       | The new title of the story.                      |
| `content`     | `string`  | No       | The new content of the story.                    |
| `coverId`     | `string`  | No       | The new CUID for the cover image. Can be `null`. |
| `isPublished` | `boolean` | No       | The new publication status.                      |

**Example Request Body:**

```json
{
  "name": "A Long Journey to the Mountains",
  "isPublished": false
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "update story successfully",
  "result": {
    "id": "clwhp7abc000308l0defghij"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a story with the specified `id` is not found.
- `403 Forbidden`: If the user is not the author of the story.
- `400 Bad Request`: If validation fails or the new name results in a slug that already exists.

---

#### 3. Delete a Story

Deletes a story from the database by its ID. The user must be the author of the story.

- **Method**: `DELETE`
- **Endpoint**: `/stories/:id`
- **Authentication**: **Required**

**Path Parameters**

| Parameter | Type     | Description                      |
| :-------- | :------- | :------------------------------- |
| `id`      | `string` | The CUID of the story to delete. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "delete story successfully",
  "result": {
    "id": "clwhp7abc000308l0defghij"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a story with the specified `id` is not found.
- `403 Forbidden`: If the user is not the author of the story.
