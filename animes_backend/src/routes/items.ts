import { Router } from "express";
import multer from "multer";
import { login, perfil, registrar } from "../controllers/auth.controllers.js";
import { logout, validarAuth } from "../middlewares/auth.middlewares.js";
import { editarAnime, eliminar, obtenerAnimes, obtenerFotos, registrarAnime } from "../controllers/items.controllers.js";

const router = Router();

const upload = multer({ storage: multer.memoryStorage()});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión y devuelve un token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: {type: string}
 *               password: {type: string}
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el token
 *       401:
 *         description: Usuario o contraseña incorrectos
 *       500:
 *         description: Error en el servidor
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/registrar:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: {type: string}
 *               password: {type: string}
 *               rol: {type: string}
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *       500:
 *         description: Error en el servidor
 */
router.post("/registrar", registrar);

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     summary: Obtiene la lista de usuarios
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Lista de usuarios obtenida
 *       500:
 *         description: Error en el servidor
 */
router.get("/perfil", validarAuth, perfil);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cierra sesión e invalida el token
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout exitoso
 */
router.post("/logout", validarAuth, logout);

/**
 * @swagger
 * /auth/blob:
 *   get:
 *     summary: Obtiene la lista completa de animes
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de animes obtenida exitosamente
 *       500:
 *         description: Error al obtener los animes
 */
router.get("/blob", validarAuth, obtenerAnimes);

/**
 * @swagger
 * /auth/blob/{id}/foto:
 *   get:
 *     summary: Obtiene la imagen de un anime por su ID
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Imagen retornada exitosamente
 *       404:
 *         description: Anime no encontrado
 */
router.get("/blob/:id/foto", validarAuth, obtenerFotos);

/**
 * @swagger
 * /auth/blob/crear:
 *   post:
 *     summary: Registra un nuevo anime con imagen
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo: {type: string}
 *               sinopsis: {type: string}
 *               calificacion: {type: number}
 *               episodios: {type: integer}
 *               estado: {type: string}
 *               formato: {type: string}
 *               genero: {type: string}
 *               file: {type: string, format: binary}
 *     responses:
 *       201:
 *         description: Anime creado exitosamente
 *       500:
 *         description: Error al registrar el anime
 */
router.post("/blob/crear", validarAuth, upload.single("file"), registrarAnime);

/**
 * @swagger
 * /auth/blob/{id}:
 *   put:
 *     summary: Actualiza un anime existente
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo: {type: string}
 *               sinopsis: {type: string}
 *               calificacion: {type: number}
 *               episodios: {type: integer}
 *               estado: {type: string}
 *               formato: {type: string}
 *               genero: {type: string}
 *               file: {type: string, format: binary}
 *     responses:
 *       200:
 *         description: Anime actualizado exitosamente
 *       500:
 *         description: Error al actualizar el anime
 */
router.put("/blob/:id", validarAuth, editarAnime)

/**
 * @swagger
 * /auth/blob/{id}:
 *   delete:
 *     summary: Elimina un anime
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Anime eliminado correctamente
 */
router.delete("/blob/:id", validarAuth, eliminar);

export default router;