import { Router, request, response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
const router = Router();

//get all auditorias
router.get('/', async (req, res) => {
    const auditoria = await prisma.auditoria.findMany({
      where: {
        estado: {
          not: 'Eliminado'
        }
      }
    })
    res.json(auditoria)
  })
//Delete auditoria by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Obtener el registro de auditoria antes de eliminarlo
      const auditoria = await prisma.auditoria.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!auditoria) {
        return res.status(404).send('Registro de auditoría no encontrado.');
      }
  
      // Eliminar físicamente el registro de auditoria
      await prisma.auditoria.delete({
        where: { id: parseInt(id) },
      });
  
      // Recuperar el elemento en la entidad de origen y cambiar su estado a 'Activo'
      if (auditoria.entidad === 'cancha') {
        await prisma.cancha.update({
          where: { id: auditoria.id_auditado },
          data: { estado: 'Activo' },
        });
      } else if (auditoria.entidad === 'deportista') {
        await prisma.deportista.update({
          where: { id: auditoria.id_auditado },
          data: { estado: 'Activo' },
        });
      } else if (auditoria.entidad === 'separacioncancha') {
        await prisma.separacionCancha.update({
          where: { id: auditoria.id_auditado },
          data: { estado: 'Activo' },
        });
      } else {
        return res.status(400).send('Entidad desconocida en el registro de auditoría.');
      }
  
      res.send('Registro de auditoría eliminado y elemento recuperado exitosamente.');
    } catch (err) {
      res.status(500).send('Error al eliminar el registro de auditoría.');
    }
  });

//recuperacion masiva
router.delete('/', async (req, res) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    try {
      // Obtener todos los registros de auditoria
      const auditorias = await prisma.auditoria.findMany();

      // Agrupar las auditorias por entidad
      const canchasIds = auditorias.filter(a => a.entidad === 'cancha').map(a => a.id_auditado);
      const deportistasIds = auditorias.filter(a => a.entidad === 'deportista').map(a => a.id_auditado);
      const separacionCanchasIds = auditorias.filter(a => a.entidad === 'separacioncancha').map(a => a.id_auditado);

      // Actualizar el estado de los registros en las entidades de origen a 'Activo'
      if (canchasIds.length > 0) {
        await prisma.cancha.updateMany({
          where: { id: { in: canchasIds } },
          data: { estado: 'Activo' },
        });
      }

      if (deportistasIds.length > 0) {
        await prisma.deportista.updateMany({
          where: { id: { in: deportistasIds } },
          data: { estado: 'Activo' },
        });
      }

      if (separacionCanchasIds.length > 0) {
        await prisma.separacionCancha.updateMany({
          where: { id: { in: separacionCanchasIds } },
          data: { estado: 'Activo' },
        });
      }

      // Eliminar todos los registros de auditoria
      await prisma.auditoria.deleteMany();

      return 'Todos los registros de auditoría eliminados y elementos recuperados exitosamente.';
    } catch (err:any) {
      throw new Error('Error al realizar la recuperación masiva: ' + err.message);
    }
  });

  try {
    const result = await transaction;
    res.send(result);
  } catch (err:any) {
    res.status(500).send(err.message);
  }
});


  export default router;