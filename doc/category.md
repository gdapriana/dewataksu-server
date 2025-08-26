# API Documentation: Categories

This document covers all endpoints related to managing destination categories.

## 🏷️ Data Model: Category

The `Category` object has the following data structure, based on the Prisma schema:

| Field         | Type                | Description                                       |
| :------------ | :------------------ | :------------------------------------------------ |
| `id`          | `String` (CUID)     | A unique identifier for the category.             |
| `name`        | `String`            | The name of the category.                         |
| `slug`        | `String`            | A unique, URL-friendly version of the name.       |
| `description` | `String` (Optional) | A short description of the category.              |
| `createdAt`   | `DateTime`          | The timestamp when the category was created.      |
| `updatedAt`   | `DateTime`          | The timestamp when the category was last updated. |

---

## Endpoints

Endpoints are divided into two categories: **Public** and **Admin**.

### 🌐 Public Endpoints

These endpoints can be accessed without authentication.

#### 1. Get a List of Categories

Retrieves a list of all categories with filtering, sorting, and pagination.

- **Method**: `GET`
- **Endpoint**: `/categories`

**Query Parameters**

| Parameter | Type     | Description                           | Default     |
| :-------- | :------- | :------------------------------------ | :---------- |
| `page`    | `number` | The current page number.              | `1`         |
| `limit`   | `number` | The number of items per page.         | `100`       |
| `search`  | `string` | Search by `name`.                     | -           |
| `sortBy`  | `string` | Sort by (`createdAt` or `updatedAt`). | `createdAt` |
| `orderBy` | `string` | Sort direction (`asc` or `desc`).     | `desc`      |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "gets category successfully",
  "result": {
    "categories": [
      {
        "id": "clwidx123000008jpabcde123",
        "name": "Beaches",
        "slug": "beaches",
        "_count": {
          "destinations": 25
        }
      },
      {
        "id": "clwidx456000108jpghijk456",
        "name": "Mountains",
        "slug": "mountains",
        "_count": {
          "destinations": 10
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 2,
      "pages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

### 🛡️ Admin Endpoints

These endpoints require both a **valid token** and an **Admin role**.

#### 1. Create a New Category

Adds a new category to the database.

- **Method**: `POST`
- **Endpoint**: `/categories`
- **Authentication**: **Admin Required**

**Request Body**

| Field         | Type     | Required | Description                                     |
| :------------ | :------- | :------- | :---------------------------------------------- |
| `name`        | `string` | Yes      | The name of the category, min 2, max 100 chars. |
| `description` | `string` | No       | Description, min 10, max 400 chars.             |

**Example Request Body:**

```json
{
  "name": "Temples",
  "description": "Historical and sacred places of worship."
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "create category successfully",
  "result": {
    "id": "clwidy789000208jplmnop789"
  }
}
```

**Possible Errors:**

- `400 Bad Request`: If validation fails or a category with the same name (and slug) already exists.

---

#### 2. Update a Category

Updates the details of an existing category by its ID.

- **Method**: `PATCH`
- **Endpoint**: `/categories/:id`
- **Authentication**: **Admin Required**

**Path Parameters**

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `id`      | `string` | The CUID of the category to update. |

**Request Body**

| Field         | Type     | Required | Description                                            |
| :------------ | :------- | :------- | :----------------------------------------------------- |
| `name`        | `string` | No       | The new name of the category, min 2, max 100 chars.    |
| `description` | `string` | No       | New description, min 10, max 400 chars. Can be `null`. |

**Example Request Body:**

```json
{
  "name": "Sacred Temples",
  "description": "Historical and sacred places of worship and cultural significance."
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "update category successfully",
  "result": {
    "id": "clwidy789000208jplmnop789"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a category with the specified `id` is not found.
- `400 Bad Request`: If validation fails or the new name results in a slug that already exists.

---

#### 3. Delete a Category

Deletes a category from the database by its ID.

- **Method**: `DELETE`
- **Endpoint**: `/categories/:id`
- **Authentication**: **Admin Required**

**Path Parameters**

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `id`      | `string` | The CUID of the category to delete. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "delete category successfully",
  "result": {
    "id": "clwidy789000208jplmnop789"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a category with the specified `id` is not found.
