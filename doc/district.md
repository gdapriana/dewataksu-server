# API Documentation: Districts

This document covers all endpoints related to managing districts.

## 🗺️ Data Model: District

The `District` object has the following data structure, based on the Prisma schema:

| Field         | Type                | Description                                       |
| :------------ | :------------------ | :------------------------------------------------ |
| `id`          | `String` (CUID)     | A unique identifier for the district.             |
| `name`        | `String`            | The name of the district.                         |
| `slug`        | `String`            | A unique, URL-friendly version of the name.       |
| `description` | `String` (Optional) | A short description of the district.              |
| `coverId`     | `String` (Optional) | The ID of the linked cover image.                 |
| `createdAt`   | `DateTime`          | The timestamp when the district was created.      |
| `updatedAt`   | `DateTime`          | The timestamp when the district was last updated. |

---

## Endpoints

Endpoints are divided into two categories: **Public** and **Admin**.

### 🌐 Public Endpoints

These endpoints can be accessed without authentication.

#### 1. Get a List of Districts

Retrieves a list of all districts with filtering, sorting, and pagination.

- **Method**: `GET`
- **Endpoint**: `/districts`

**Query Parameters**

| Parameter | Type     | Description                                    | Default     |
| :-------- | :------- | :--------------------------------------------- | :---------- |
| `page`    | `number` | The current page number.                       | `1`         |
| `limit`   | `number` | The number of items per page.                  | `10`        |
| `search`  | `string` | Search by `name` or `description`.             | -           |
| `sortBy`  | `string` | Sort by (`createdAt`, `updatedAt`, `popular`). | `createdAt` |
| `orderBy` | `string` | Sort direction (`asc` or `desc`).              | `desc`      |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "gets district successfully",
  "result": {
    "districts": [
      {
        "id": "clwht1a2b000008jpklmnpqr",
        "name": "Ubud",
        "slug": "ubud",
        "description": "Ubud is known as the cultural heart of Bali...",
        "cover": {
          "url": "[https://example.com/images/ubud.jpg](https://example.com/images/ubud.jpg)"
        },
        "_count": {
          "destinations": 15
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

#### 2. Get a Single District by Slug

Retrieves the full details of a single district and its associated destinations by its unique `slug`.

- **Method**: `GET`
- **Endpoint**: `/districts/:slug`

**Path Parameters**

| Parameter | Type     | Description                      |
| :-------- | :------- | :------------------------------- |
| `slug`    | `string` | The unique slug of the district. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "get district successfully",
  "result": {
    "id": "clwht1a2b000008jpklmnpqr",
    "name": "Ubud",
    "description": "Ubud is known as the cultural heart of Bali...",
    "_count": {
      "destinations": 15
    },
    "cover": {
      "url": "[https://example.com/images/ubud.jpg](https://example.com/images/ubud.jpg)"
    },
    "destinations": [
      {
        "_count": {
          "likes": 120,
          "bookmarks": 30
        },
        "name": "Tegalalang Rice Terrace",
        "cover": {
          "url": "[https://example.com/images/tegalalang.jpg](https://example.com/images/tegalalang.jpg)"
        },
        "address": "Jl. Raya Tegallalang, Gianyar",
        "content": "Famous for its beautiful scenes of rice paddies...",
        "id": "clwht2cde000108jpstuvwxy",
        "slug": "tegalalang-rice-terrace"
      }
    ]
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a district with the specified `slug` is not found.

---

### 🛡️ Admin Endpoints

These endpoints require both a **valid token** and an **Admin role**.

#### 1. Create a New District

Adds a new district to the database.

- **Method**: `POST`
- **Endpoint**: `/districts`
- **Authentication**: **Admin Required**

**Request Body**

| Field         | Type     | Required | Description                                     |
| :------------ | :------- | :------- | :---------------------------------------------- |
| `name`        | `string` | Yes      | The name of the district, min 2, max 100 chars. |
| `description` | `string` | No       | Description, min 10, max 400 chars.             |
| `coverId`     | `string` | No       | The CUID of the cover image.                    |

**Example Request Body:**

```json
{
  "name": "Canggu",
  "description": "A coastal village and an up-and-coming resort area.",
  "coverId": "clwht3fgh000208jpabcdefg"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "create district successfully",
  "result": {
    "id": "clwht3ijk000308jphijklmn"
  }
}
```

**Possible Errors:**

- `400 Bad Request`: If validation fails or a district with the same name (and slug) already exists.

---

#### 2. Update a District

Updates the details of an existing district by its ID.

- **Method**: `PATCH`
- **Endpoint**: `/districts/:id`
- **Authentication**: **Admin Required**

**Path Parameters**

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `id`      | `string` | The CUID of the district to update. |

**Request Body**

| Field         | Type     | Required | Description                                             |
| :------------ | :------- | :------- | :------------------------------------------------------ |
| `name`        | `string` | No       | The new name of the district, min 2, max 100 chars.     |
| `description` | `string` | No       | New description, min 10, max 2000 chars. Can be `null`. |
| `coverId`     | `string` | No       | The new CUID for the cover image. Can be `null`.        |

**Example Request Body:**

```json
{
  "name": "Canggu Beach",
  "description": "A coastal village famous for its surf spots and vibrant nightlife."
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "update district successfully",
  "result": {
    "id": "clwht3ijk000308jphijklmn"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a district with the specified `id` is not found.
- `400 Bad Request`: If validation fails or the new name results in a slug that already exists.

---

#### 3. Delete a District

Deletes a district from the database by its ID.

- **Method**: `DELETE`
- **Endpoint**: `/districts/:id`
- **Authentication**: **Admin Required**

**Path Parameters**

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `id`      | `string` | The CUID of the district to delete. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "delete district successfully",
  "result": {
    "id": "clwht3ijk000308jphijklmn"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a district with the specified `id` is not found.
