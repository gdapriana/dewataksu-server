import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /users:
 * get:
 * summary: Mengambil daftar semua pengguna
 * tags: [Users]
 * responses:
 * 200:
 * description: Berhasil mengambil daftar pengguna.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/User'
 */
router.get("/users", (req, res) => {
  // Logika controller untuk mendapatkan semua user
  res.status(200).json({ message: "List of users" });
});

/**
 * @swagger
 * /users:
 * post:
 * summary: Membuat pengguna baru
 * tags: [Users]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/User'
 * responses:
 * 201:
 * description: Pengguna berhasil dibuat.
 */
router.post("/users", (req, res) => {
  res.status(201).json({ message: "User created" });
});

export default router;
