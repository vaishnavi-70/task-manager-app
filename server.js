const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/taskmanager', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.log('MongoDB Connection Error:', err));

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true }
});
const Task = mongoose.model('Task', taskSchema);
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        // Frontend ke sath match karne ke liye _id ko id mein map kar rahe hain
        const formattedTasks = tasks.map(t => ({ id: t._id.toString(), title: t.title }));
        res.json(formattedTasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.post('/api/tasks', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: "Task title is required!" });
        }
        const newTask = new Task({ title });
        await newTask.save();
        res.status(201).json({ id: newTask._id.toString(), title: newTask.title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.json({ message: "Task deleted successfully", id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});