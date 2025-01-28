const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(express.static('public'));

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./empleados.db');

// Endpoint para obtener empleados
app.get('/api/empleados', (req, res) => {
    db.all('SELECT * FROM empleados', [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener los empleados.' });
        }
        res.json(rows);
    });
});

// Endpoint para agregar un nuevo empleado
app.post('/api/empleados', (req, res) => {
    const { nombre, edad, salario } = req.body;

    // Validación básica
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es obligatorio y debe ser una cadena de texto.' });
    }
    if (typeof edad !== 'number' || edad <= 0) {
        return res.status(400).json({ error: 'La edad debe ser un número positivo.' });
    }
    if (typeof salario !== 'number' || salario < 0) {
        return res.status(400).json({ error: 'El salario debe ser un número no negativo.' });
    }

    const query = 'INSERT INTO empleados (nombre, edad, salario) VALUES (?, ?, ?)';
    db.run(query, [nombre, edad, salario], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al agregar el empleado.' });
        }
        res.status(201).json({ id: this.lastID, nombre, edad, salario });
    });
});

// Endpoint para editar un empleado
app.put('/api/empleados/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, edad, salario } = req.body;

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre es obligatorio y debe ser una cadena de texto.' });
    }
    if (typeof edad !== 'number' || edad <= 0) {
        return res.status(400).json({ error: 'La edad debe ser un número positivo.' });
    }
    if (typeof salario !== 'number' || salario < 0) {
        return res.status(400).json({ error: 'El salario debe ser un número no negativo.' });
    }

    const query = 'UPDATE empleados SET nombre = ?, edad = ?, salario = ? WHERE id = ?';
    db.run(query, [nombre, edad, salario, id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al editar el empleado.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado.' });
        }
        res.json({ id, nombre, edad, salario });
    });
});

// Endpoint para eliminar un empleado
app.delete('/api/empleados/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM empleados WHERE id = ?';
    db.run(query, [id], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al eliminar el empleado.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado.' });
        }
        res.status(204).send(); // No content
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
