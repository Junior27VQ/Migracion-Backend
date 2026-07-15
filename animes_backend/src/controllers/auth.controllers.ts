import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../database/prisma.js";

export const login = async (req: Request, res: Response)=>{
    const { username, password } = req.body;
    try{
        const usuario = await prisma.usuarios.findFirst({
            where: {username: username} 
        })
        if(!usuario){
            res.status(401).json({error: "Usuario o contraseña incorrectas"});
            return;
        }

        const passwordCorrecto = await bcrypt.compare(password, usuario.password)
        if(!passwordCorrecto){
            res.status(401).json({error: "Usuario o contraseña incorrectas"});
            return;
        }

        const token = jwt.sign(
            {id: usuario.id, username: usuario.username},
            process.env.JWT_SECRET || "secreto",
            {expiresIn: "2h"}
        )

        res.json({token});

    }catch(error){
        console.error(error);
        res.status(500).json({error: "Error en el servidor"})
    }
}

export const registrar =async (req: Request, res: Response) => {
    const { username, password, rol } = req.body;
    try {
        const nuevoUsuario = await prisma.usuarios.create({
            data:{
                username: username,
                password: password,
                rol: rol
            }
        })
        res.json(nuevoUsuario);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error en el servidor"})
    }
}

export const perfil =async (req: Request, res: Response) => {
    try {
        const auth = await prisma.usuarios.findMany();
        res.status(201).json(auth);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error en el servidor"})
    }
}