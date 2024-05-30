import {Router, Request, Response} from 'express';
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
const router = Router();

//get all canchas
router.get('/', async (req, res) => {
    const cancha = await prisma.cancha.findMany({
      where: {
        estado: {
          not: 'Eliminado'
        }
      }
    })
    res.json(cancha)
  })
//localhost:3000/cancha/1
router.get('/:id', async (req, res) => {
    const { id } = req.params
    const cancha = await prisma.cancha.findUnique({
      where: {
        id: parseInt(id)
      }
    })
    if (cancha && cancha.estado !== 'Eliminado') {
      res.json(cancha)
    } else {
      res.status(404).json({ message: 'Cancha no encontrada o eliminada' })
    }
  })
//post cancha
router.post('/', async (req, res) => {
    const { descripcion } = req.body
    const cancha = await prisma.cancha.create({
      data: {
          descripcion: descripcion,
          estado: "Activo",
      }
    })
    res.json(cancha)
  })
//put cancha
router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { descripcion, estado } = req.body
    const cancha = await prisma.cancha.update({
      where: {
        id: parseInt(id)
      },
      data: {
        descripcion,
        estado,
      }
    })
    res.json(cancha)
  })
//delete cancha
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Realizar eliminación lógica de la cancha
    const cancha = await prisma.cancha.update({
      where: {
        id: parseInt(id),
      },
      data: {
        estado: 'Eliminado', // Cambio de estado en lugar de eliminación física
      },
    });

    // Insertar registro en la tabla de Auditoria
    await prisma.auditoria.create({
      data: {
        entidad: 'cancha',
        detalle: `ELIMINO CON ID{${id}} en la entidad cancha`,
        fecha: '2024-10-10T00:00:00.000Z',
        id_auditado: parseInt(id),
        estado: 'Activo',
      },
    });

    res.json(cancha);
  } catch (err) {
    res.status(500).send('Error al eliminar la cancha.');
  }
})

export default router;