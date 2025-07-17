const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { nombre_usuario, contrasena, rol } = req.body;
    if (!['lider', 'miembro'].includes(rol)) {
        return res.status(400).json({ message: 'Rol inválido' });
    }

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const query = `
      INSERT INTO usuarios (nombre_usuario, contrasena, rol)
      VALUES ($1, $2, $3)
      RETURNING id, nombre_usuario, rol;
    `;
        const { rows } = await pool.query(query, [nombre_usuario, hashedPassword, rol]);
        res.status(201).json(rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ message: 'El nombre de usuario ya existe' });
        }
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    try {
        const query = 'SELECT * FROM usuarios WHERE nombre_usuario = $1';
        const { rows } = await pool.query(query, [nombre_usuario]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
});

// Nuevo endpoint para obtener miembros (solo para líderes)
router.get('/members', async (req, res) => {
    try {
        const query = 'SELECT id, nombre_usuario FROM usuarios WHERE rol = $1';
        const { rows } = await pool.query(query, ['miembro']);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener miembros', error: error.message });
    }
});

module.exports = router;