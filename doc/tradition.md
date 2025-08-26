# API Documentation: Traditions

This document covers all endpoints related to managing traditions.

## 🏛️ Data Model: Tradition

The `Tradition` object has the following data structure, based on the Prisma schema:

| Field         | Type                | Description                                           |
| :------------ | :------------------ | :---------------------------------------------------- |
| `id`          | `String` (CUID)     | A unique identifier for the tradition.                |
| `name`        | `String`            | The name of the tradition.                            |
| `slug`        | `String`            | A unique, URL-friendly version of the name.           |
| `content`     | `String`            | The detailed content or description of the tradition. |
| `coverId`     | `String` (Optional) | The ID of the linked cover image.                     |
| `isPublished` | `Boolean`           | Indicates if the tradition is visible to the public.  |
| `createdAt`   | `DateTime`          | The timestamp when the tradition was created.         |
| `updatedAt`   | `DateTime`          | The timestamp when the tradition was last updated.    |

---

## Endpoints

Endpoints are divided into two categories: **Public** and **Admin**.

### 🌐 Public Endpoints

These endpoints can be accessed without authentication.

#### 1. Get a List of Traditions

Retrieves a list of all published traditions with filtering, sorting, and pagination.

- **Method**: `GET`
- **Endpoint**: `/traditions`

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
  "message": "gets tradition successfully",
  "result": {
    "traditions": [
      {
        "id": "clwgk1q2b000008jp5z7g3h9y",
        "name": "Ngaben Ceremony",
        "slug": "ngaben-ceremony",
        "_count": {
          "likes": 150,
          "bookmarks": 45,
          "comments": 20
        },
        "cover": {
          "url": "[https://example.com/images/ngaben.jpg](https://example.com/images/ngaben.jpg)"
        },
        "content": "Ngaben is a traditional cremation ceremony in Bali...",
        "createdAt": "2025-08-28T12:00:00.000Z",
        "updatedAt": "2025-08-28T12:00:00.000Z"
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

#### 2. Get a Single Tradition by Slug

Retrieves the full details of a single tradition by its unique `slug`.

- **Method**: `GET`
- **Endpoint**: `/traditions/:slug`

**Path Parameters**

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `slug`    | `string` | The unique slug of the tradition. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "get tradition successfully",
  "result": {
    "id": "clwgk1q2b000008jp5z7g3h9y",
    "name": "Ngaben Ceremony",
    "slug": "ngaben-ceremony",
    "_count": {
      "likes": 150,
      "bookmarks": 45,
      "comments": 20
    },
    "comments": [],
    "cover": {
      "url": "[https://example.com/images/ngaben.jpg](https://example.com/images/ngaben.jpg)"
    },
    "content": "Ngaben is a traditional cremation ceremony in Bali...",
    "createdAt": "2025-08-28T12:00:00.000Z",
    "updatedAt": "2025-08-28T12:00:00.000Z"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a tradition with the specified `slug` is not found.

---

### 🛡️ Admin Endpoints

These endpoints require both a **valid token** and an **Admin role**.

#### 1. Create a New Tradition

Adds a new tradition to the database.

- **Method**: `POST`
- **Endpoint**: `/traditions`
- **Authentication**: **Admin Required**

**Request Body**

| Field         | Type      | Required | Description                                      |
| :------------ | :-------- | :------- | :----------------------------------------------- |
| `name`        | `string`  | Yes      | The name of the tradition, min 2 characters.     |
| `content`     | `string`  | Yes      | The main content, min 10 characters.             |
| `coverId`     | `string`  | No       | The CUID of the cover image. Can be `null`.      |
| `isPublished` | `boolean` | No       | Sets the publication status. Defaults to `true`. |

**Example Request Body:**

```json
{
  "name": "Omed-omedan Festival",
  "content": "Omed-omedan is a unique kissing festival held annually in Bali...",
  "coverId": "clwgk2abc000108jpabcd1234",
  "isPublished": true
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "create tradition successfully",
  "result": {
    "id": "clwgk2efg000208jphijk5678"
  }
}
```

**Possible Errors:**

- `400 Bad Request`: If validation fails or a tradition with the same name (and slug) already exists.

---

#### 2. Update a Tradition

Updates the details of an existing tradition by its ID.

- **Method**: `PATCH`
- **Endpoint**: `/traditions/:id`
- **Authentication**: **Admin Required**

**Path Parameters**

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `string` | The CUID of the tradition to update. |

**Request Body**

| Field         | Type      | Required | Description                                      |
| :------------ | :-------- | :------- | :----------------------------------------------- |
| `name`        | `string`  | No       | The new name of the tradition, min 2 characters. |
| `content`     | `string`  | No       | The new content, min 10 characters.              |
| `coverId`     | `string`  | No       | The new CUID for the cover image. Can be `null`. |
| `isPublished` | `boolean` | No       | The new publication status.                      |

**Example Request Body:**

```json
{
  "name": "Omed-omedan Kissing Festival",
  "isPublished": false
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "update tradition successfully",
  "result": {
    "id": "clwgk2efg000208jphijk5678"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a tradition with the specified `id` is not found.
- `400 Bad Request`: If validation fails or the new name results in a slug that already exists.

---

#### 3. Delete a Tradition

Deletes a tradition from the database by its ID.

- **Method**: `DELETE`
- **Endpoint**: `/traditions/:id`
- **Authentication**: **Admin Required**

**Path Parameters**

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `string` | The CUID of the tradition to delete. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "delete tradition successfully",
  "result": {
    "id": "clwgk2efg000208jphijk5678"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a tradition with the specified `id` is not found.
