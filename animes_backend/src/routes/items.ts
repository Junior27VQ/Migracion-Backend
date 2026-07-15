import { Router } from "express";
import multer from "multer";
import { login, perfil, registrar } from "../controllers/auth.controllers.js";
import { logout, validarAuth } from "../middlewares/auth.middlewares.js";
import { editarAnime, eliminar, obtenerAnimes, obtenerFotos, registrarAnime } from "../controllers/items.controllers.js";

const router = Router();

const upload = multer({ storage: multer.memoryStorage()});

router.post("/login", login);
router.post("/registrar", validarAuth, registrar);
router.get("/perfil", validarAuth, perfil);
router.post("/logout", logout);

router.get("/blob", validarAuth, obtenerAnimes);
router.get("/blob/:id/foto", validarAuth, obtenerFotos);
router.post("/blob/crear", validarAuth, upload.single("file"), registrarAnime);
router.put("/blob/:id", validarAuth, upload.single("file"), editarAnime)
router.delete("/blob/:id", validarAuth, eliminar)

export default router;