const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { processMessage } = require('../services/deepseek');

// Nueva ruta para previsualización
router.post('/preview', authMiddleware, roleMiddleware('lider'), async (req, res) => {
    const { mensaje } = req.body;

    try {
        const cordialMessage = await processMessage(mensaje);
        res.json({
            originalMessage: mensaje,
            cordialMessage: cordialMessage
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar previsualización', error: error.message });
    }
});

// Nueva ruta para previsualización de respuestas
router.post('/preview-response', authMiddleware, roleMiddleware('miembro'), async (req, res) => {
    const { respuesta, taskId } = req.body;

    try {
        // Obtener la tarea original para tener el contexto
        const taskQuery = 'SELECT mensaje, mensaje_cordial FROM tareas WHERE id = $1';
        const taskResult = await pool.query(taskQuery, [taskId]);

        if (taskResult.rows.length === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        const originalTask = taskResult.rows[0];
        const context = {
            mensaje_original: originalTask.mensaje_cordial || originalTask.mensaje
        };

        const cordialResponse = await processMessage(respuesta, context);
        res.json({
            originalResponse: respuesta,
            cordialResponse: cordialResponse
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al generar previsualización de respuesta', error: error.message });
    }
});

router.post('/assign', authMiddleware, roleMiddleware('lider'), async (req, res) => {
    const { nombre, asignado_a, mensaje, mensajeOriginal, mensajeCordial, tipoMensajeSeleccionado } = req.body;

    try {
        // Validar que el usuario asignado existe y es miembro
        const userQuery = 'SELECT id FROM usuarios WHERE id = $1 AND rol = $2';
        const userResult = await pool.query(userQuery, [asignado_a, 'miembro']);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Usuario asignado no válido o no es miembro' });
        }

        let selectedType = tipoMensajeSeleccionado || 'original';
        let originalMessage = mensajeOriginal || mensaje;
        let cordialMessage = mensajeCordial;

        // Solo procesar con IA si NO viene de una previsualización
        if (!mensajeCordial) {
            cordialMessage = await processMessage(originalMessage);
        }

        const query = `INSERT INTO tareas (nombre, asignado_a, mensaje, mensaje_cordial, mensaje_original, tipo_mensaje_seleccionado, creado_por)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;`;
        const { rows } = await pool.query(query, [
            nombre,
            asignado_a,
            selectedType === 'original' ? originalMessage : cordialMessage, // mensaje que se muestra
            cordialMessage,
            originalMessage,
            selectedType,
            req.user.id,
        ]);
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al asignar tarea', error: error.message });
    }
});

router.post('/respond/:taskId', authMiddleware, roleMiddleware('miembro'), async (req, res) => {
    const { taskId } = req.params;
    const { respuesta, respuestaOriginal, respuestaCordial, tipoRespuestaSeleccionada } = req.body;
    try {
        // Primero obtenemos la tarea original para tener el contexto del mensaje de asignación
        const taskQuery = 'SELECT mensaje, mensaje_cordial FROM tareas WHERE id = $1 AND asignado_a = $2';
        const taskResult = await pool.query(taskQuery, [taskId, req.user.id]);

        if (taskResult.rows.length === 0) {
            return res.status(403).json({ message: 'No autorizado o tarea no encontrada' });
        }

        const originalTask = taskResult.rows[0];
        let selectedType = tipoRespuestaSeleccionada || 'original';
        let originalResponse = respuestaOriginal || respuesta;
        let cordialResponse = respuestaCordial;

        // Solo procesar con IA si NO viene de una previsualización
        if (!respuestaCordial) {
            const context = {
                mensaje_original: originalTask.mensaje_cordial || originalTask.mensaje
            };
            cordialResponse = await processMessage(originalResponse, context);
        }

        const query = `UPDATE tareas
            SET respuesta = $1, respuesta_cordial = $2, respuesta_original = $3, tipo_respuesta_seleccionada = $4, estado = 'completada'
            WHERE id = $5 AND asignado_a = $6
            RETURNING *;`;
        const { rows } = await pool.query(query, [
            selectedType === 'original' ? originalResponse : cordialResponse, // respuesta que se muestra
            cordialResponse,
            originalResponse,
            selectedType,
            taskId,
            req.user.id,
        ]);
        if (rows.length === 0) {
            return res.status(403).json({ message: 'No autorizado o tarea no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al responder tarea', error: error.message });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const query = req.user.rol === 'lider'
            ? `SELECT t.*, u1.nombre_usuario as asignado_nombre, u2.nombre_usuario as creado_por_nombre
            FROM tareas t
            JOIN usuarios u1 ON t.asignado_a = u1.id
            JOIN usuarios u2 ON t.creado_por = u2.id`
            : `SELECT t.*, u1.nombre_usuario as asignado_nombre, u2.nombre_usuario as creado_por_nombre
            FROM tareas t
            JOIN usuarios u1 ON t.asignado_a = u1.id
            JOIN usuarios u2 ON t.creado_por = u2.id
            WHERE t.asignado_a = $1`;
        const { rows } = await pool.query(query, req.user.rol === 'lider' ? [] : [req.user.id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tareas', error: error.message });
    }
});

module.exports = router;