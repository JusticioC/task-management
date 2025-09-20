// Import necessary modules
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Helper & Validation Functions ---
const validateTask = (req, res, next) => {
    const { title, priority, deadline } = req.body;
    const validPriorities = ['Low', 'Medium', 'High'];
    if (req.method === 'POST' && (!title || typeof title !== 'string' || title.trim() === '')) {
        return res.status(400).json({ message: 'Title is required and must be a non-empty string.' });
    }
    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority level. Must be one of: Low, Medium, High.' });
    }
    if (deadline && isNaN(new Date(deadline).getTime())) {
        return res.status(400).json({ message: 'Invalid deadline format.' });
    }
    next();
};

// --- API Endpoints ---
app.post('/tasks', validateTask, async (req, res) => {
    try {
        const { title, description, category, priority, deadline } = req.body;
        const query = `INSERT INTO tasks (title, description, category, priority, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
        const values = [title, description, category, priority, deadline];
        const { rows } = await db.query(query, values);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const { category, priority, sortBy, sortOrder } = req.query; // Diambil dari req.query, bukan req.body
        let query = 'SELECT * FROM tasks';
        const whereClauses = [];
        const queryParams = [];
        if (category) {
            queryParams.push(category);
            whereClauses.push(`category = $${queryParams.length}`);
        }
        if (priority) {
            queryParams.push(priority);
            whereClauses.push(`priority = $${queryParams.length}`);
        }
        if (whereClauses.length > 0) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }
        const validSortBy = ['created_at', 'priority', 'deadline'];
        const validSortOrder = ['asc', 'desc'];
        if (sortBy && validSortBy.includes(sortBy)) {
            const order = (sortOrder && validSortOrder.includes(sortOrder.toLowerCase())) ? sortOrder : 'asc';
            query += ` ORDER BY ${sortBy} ${order}`;
        }
        const { rows } = await db.query(query, queryParams);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.put('/tasks/:id', validateTask, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, priority, deadline } = req.body;
        const query = `UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), category = COALESCE($3, category), priority = COALESCE($4, priority), deadline = COALESCE($5, deadline), updated_at = NOW() WHERE id = $6 RETURNING *;`;
        const values = [title, description, category, priority, deadline, id];
        const { rows } = await db.query(query, values);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM tasks WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.status(200).json({ message:'Deleted Successfuly'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// --- Server Start ---
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;