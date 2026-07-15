import { type Request, type Response, type NextFunction, json } from "express";
import jwt from "jsonwebtoken";
import { esToken } from "./blackList.middlewares.js";
import { agregarToken } from "../middlewares/blackList.middlewares.js";

export interface CustomRequest extends Request {
    usuario?: any;
}

export const validarAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        res.status(401).json({error: "Acceso denegado"});
        return;
    };

    if(esToken(token)){
        res.status(401).json({error: "Token en blackList, acceso denegado"})
        return;
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET || "secreto")
        req.usuario = verificado;
        next();

    } catch (error) {
        console.error(error);
        res.status(403).json({error: "Token invalido o expirado"})
    }
};

export const logout = (req: CustomRequest, res: Response) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        res.status(400).json({error: "No se proporciono el token"});
        return;
    };

    agregarToken(token);

    res.status(200).json({mensaje: "Logout exitoso, token invalidado"});
};