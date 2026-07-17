import express from "express";
import cors from "cors";
import itemsRouter from "./routes/items.js"
import { swaggerDocs } from "./swagger.js";

const app = express();
const PORT = 3001;

app.use(cors());

app.use(express.json());

app.use("/auth", itemsRouter)

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);

    swaggerDocs(app, PORT);
})