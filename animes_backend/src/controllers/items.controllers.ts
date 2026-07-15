import { type Request, type Response } from "express";
import { Prisma } from "../../generated/prisma/browser.js";
import multer from "multer";
import prisma from "../database/prisma.js";

export const obtenerAnimes = async (req: Request, res: Response) =>{
    try {
        const animes = await prisma.items.findMany({
            select: {
                id:true,
                titulo: true,
                sinopsis:true,
                calificacion: true,
                episodios: true,
                estado: true,
                formato: true,
                genero: true,
                mime_type: true,

            }
        })
        res.json(animes);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtener los Animes"})
    }
}

export const obtenerFotos =async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const anime = await prisma.items.findUnique({
            where: {id: Number(id)}
        });
        if(!anime){
            res.status(404).json({error: "Anime no encontrado"})
            return;
        }

        res.setHeader("content-type", anime?.mime_type || "application/octet-stream");
        res.send(anime?.foto);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al obtenetener la imagen"});
    }
}

export const registrarAnime = async (req: Request, res: Response) => {
    const {titulo, sinopsis, calificacion, episodios, estado, formato, genero} = req.body;
    const arcrivo = req.file;

    if(!arcrivo){
        res.status(400).json({error: "Debe seleccionar una foto"})
        return;
    }
    try {
        const nuevoAnime = await prisma.items.create({
            data: {
                titulo: titulo,
                sinopsis:sinopsis,
                calificacion: parseFloat(calificacion) || 0, 
                episodios: parseInt(episodios) || 0,
                estado: estado,
                formato: formato,
                genero: genero,
                mime_type: arcrivo?.mimetype || null,
                foto: arcrivo?.buffer ? Buffer.from(arcrivo.buffer) : null
            }
        })

        res.status(201).json(nuevoAnime);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al registrar el Anime"})
    }
}

export const editarAnime = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {titulo, sinopsis, calificacion, episodios, estado, formato, genero} = req.body;
    const arcrivo = req.file;

    try {
        const animeActualizado = await prisma.items.update({
            where: { id: Number(id)},
            data:{
                titulo: titulo,
                sinopsis:sinopsis,
                calificacion: parseFloat(calificacion) || 0, 
                episodios: parseInt(episodios) || 0,
                estado: estado,
                formato: formato,
                genero: genero,
                mime_type: arcrivo?.mimetype || null,
                foto: arcrivo?.buffer ? Buffer.from(arcrivo.buffer) : null
            }
        })

        res.status(200).json(animeActualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al registrar el Anime"})
    }
}

export const eliminar = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const anime = await prisma.items.delete({
            where:  { id: Number(id) }
        });

    res.status(200).json({body: "Anime eliminado correctamente"});

    } catch (error) {
        
    }
}