# API Documentation: Destinations

This document covers all endpoints related to managing tourist destinations.

## 📍 Data Model: Destination

The `Destination` object has the following data structure, based on the Prisma schema:

| Field         | Type                | Description                                            |
| :------------ | :------------------ | :----------------------------------------------------- |
| `id`          | `String` (CUID)     | A unique identifier for the destination.               |
| `name`        | `String`            | The name of the destination.                           |
| `slug`        | `String`            | A unique, URL-friendly version of the name.            |
| `content`     | `String` (Optional) | The detailed description of the destination.           |
| `address`     | `String` (Optional) | The physical address of the destination.               |
| `mapUrl`      | `String` (Optional) | A URL to a map location (e.g., Google Maps).           |
| `price`       | `Int` (Optional)    | The entrance fee or price, defaults to `0`.            |
| `coverId`     | `String` (Optional) | The ID of the linked cover image.                      |
| `districtId`  | `String`            | The ID of the district where it's located.             |
| `categoryId`  | `String`            | The ID of the category it belongs to.                  |
| `isPublished` | `Boolean`           | Indicates if the destination is visible to the public. |
| `createdAt`   | `DateTime`          | The timestamp when the destination was created.        |
| `updatedAt`   | `DateTime`          | The timestamp when the destination was last updated.   |

---

## Endpoints

Endpoints are divided into two categories: **Public** and **Admin**.

### 🌐 Public Endpoints

These endpoints can be accessed without authentication.

#### 1. Get a List of Destinations

Retrieves a list of all published destinations with filtering, sorting, and pagination.

- **Method**: `GET`
- **Endpoint**: `/destinations`

**Query Parameters**

| Parameter     | Type     | Description                                                                | Default     |
| :------------ | :------- | :------------------------------------------------------------------------- | :---------- |
| `page`        | `number` | The current page number.                                                   | `1`         |
| `limit`       | `number` | The number of items per page.                                              | `10`        |
| `search`      | `string` | Search by `name`, `content`, `address`, `category`, `district`, or `tags`. | -           |
| `isPublished` | `string` | Filter by publication status (`1` for true, `0` for false).                | -           |
| `sortBy`      | `string` | Sort by (`createdAt`, `updatedAt`, `price`, `bookmarked`, `liked`).        | `createdAt` |
| `orderBy`     | `string` | Sort direction (`asc` or `desc`).                                          | `desc`      |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "gets destination successfully",
  "result": {
    "destinations": [
      {
        "id": "clwjx1abc000008jp1234defg",
        "name": "Tanah Lot Temple",
        "slug": "tanah-lot-temple",
        "content": "A rock formation off the Indonesian island of Bali...",
        "address": "Beraban, Kediri, Tabanan Regency, Bali",
        "price": 60000,
        "isPublished": true,
        "cover": { "id": "...", "url": "...", "publicId": "..." },
        "category": { "id": "...", "name": "Temples", "slug": "temples" },
        "district": { "id": "...", "name": "Tabanan", "slug": "tabanan" },
        "tags": [{ "id": "...", "name": "Sunset", "slug": "sunset" }],
        "_count": { "likes": 500, "bookmarks": 150 }
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

#### 2. Get a Single Destination by Slug

Retrieves the full details of a single destination by its unique `slug`.

- **Method**: `GET`
- **Endpoint**: `/destinations/:slug`

**Path Parameters**

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `slug`    | `string` | The unique slug of the destination. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "get destination successfully",
  "result": {
    "id": "clwjx1abc000008jp1234defg",
    "name": "Tanah Lot Temple",
    "slug": "tanah-lot-temple",
    "content": "A rock formation off the Indonesian island of Bali...",
    "address": "Beraban, Kediri, Tabanan Regency, Bali",
    "mapUrl": "[https://maps.google.com/?q=-8.6212,115.0868](https://maps.google.com/?q=-8.6212,115.0868)",
    "price": 60000,
    "isPublished": true,
    "cover": { "...": "..." },
    "category": { "...": "..." },
    "district": { "...": "..." },
    "tags": [{ "...": "..." }],
    "galleries": [{ "...": "..." }],
    "comments": [{ "...": "..." }],
    "_count": { "likes": 500, "bookmarks": 150, "comments": 80 }
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a destination with the specified `slug` is not found.

---

### 🛡️ Admin Endpoints

These endpoints require both a **valid token** and an **Admin role**.

#### 1. Create a New Destination

Adds a new destination to the database.

- **Method**: `POST`
- **Endpoint**: `/destinations`
- **Authentication**: **Admin Required**

**Request Body**

| Field         | Type            | Required | Description                                      |
| :------------ | :-------------- | :------- | :----------------------------------------------- |
| `name`        | `string`        | Yes      | The name of the destination.                     |
| `districtId`  | `string` (CUID) | Yes      | The ID of the associated district.               |
| `categoryId`  | `string` (CUID) | Yes      | The ID of the associated category.               |
| `content`     | `string`        | No       | Detailed description of the destination.         |
| `address`     | `string`        | No       | Physical address.                                |
| `mapUrl`      | `string` (URL)  | No       | A valid URL to a map.                            |
| `price`       | `number`        | No       | Entrance fee (must be non-negative).             |
| `coverId`     | `string` (CUID) | No       | The ID of the cover image.                       |
| `isPublished` | `boolean`       | No       | Sets the publication status. Defaults to `true`. |
| `tags`        | `Array<string>` | No       | An array of tag names.                           |

**Example Request Body:**

```json
{
  "name": "Uluwatu Temple",
  "districtId": "clwht3ijk000308jphijklmn",
  "categoryId": "clwidy789000208jplmnop789",
  "content": "A magnificent temple perched on a cliff edge.",
  "address": "Pecatu, South Kuta, Badung Regency, Bali",
  "price": 50000,
  "tags": ["Temple", "Sunset", "Kecak Dance"]
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "create destination successfully",
  "result": {
    "id": "clwjx2efg000108jp5678hijk"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If `districtId` or `categoryId` does not exist.
- `400 Bad Request`: If validation fails or a destination with the same name (and slug) already exists.

---

#### 2. Update a Destination

Updates the details of an existing destination by its ID.

- **Method**: `PATCH`
- **Endpoint**: `/destinations/:id`
- **Authentication**: **Admin Required**

**Path Parameters**

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | The CUID of the destination to update. |

**Request Body**
_All fields are optional._

| Field         | Type            | Description                                     |
| :------------ | :-------------- | :---------------------------------------------- |
| `name`        | `string`        | The new name of the destination.                |
| `districtId`  | `string` (CUID) | The new district ID.                            |
| `categoryId`  | `string` (CUID) | The new category ID.                            |
| `content`     | `string`        | New description. Can be `null`.                 |
| `address`     | `string`        | New address. Can be `null`.                     |
| `mapUrl`      | `string` (URL)  | New map URL. Can be `null`.                     |
| `price`       | `number`        | New price (must be non-negative).               |
| `coverId`     | `string` (CUID) | New cover image ID. Can be `null`.              |
| `isPublished` | `boolean`       | New publication status.                         |
| `tags`        | `Array<string>` | A new array of tag names to set. Can be `null`. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "update destination successfully",
  "result": {
    "id": "clwjx2efg000108jp5678hijk"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If the destination, `districtId`, or `categoryId` is not found.
- `400 Bad Request`: If validation fails or the new name results in a slug that already exists.

---

#### 3. Delete a Destination

Deletes a destination from the database by its ID.

- **Method**: `DELETE`
- **Endpoint**: `/destinations/:id`
- **Authentication**: **Admin Required**

**Path Parameters**

| Parameter | Type     | Description                            |
| :-------- | :------- | :------------------------------------- |
| `id`      | `string` | The CUID of the destination to delete. |

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "delete destination successfully",
  "result": {
    "id": "clwjx2efg000108jp5678hijk"
  }
}
```

**Possible Errors:**

- `404 Not Found`: If a destination with the specified `id` is not found.
