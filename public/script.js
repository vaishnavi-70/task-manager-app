const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

async function fetchTasks() {
    try {
        const res = await fetch('/api/tasks');
        const tasks = await res.json();
        taskList.innerHTML = '';
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task.title}</span>
                <button onclick="deleteTask('${task.id}')">Delete</button>
            `;
            taskList.appendChild(li);
        });
    } catch (err) {
        console.error("Error fetching tasks:", err);
    }
}

addBtn.addEventListener('click', async () => {
    const title = taskInput.value.trim();
    if (!title) return alert('Please enter a task!');

    try {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        
        if (res.ok) {
            taskInput.value = '';
            fetchTasks();
        }
    } catch (err) {
        console.error("Error adding task:", err);
    }
});

async function deleteTask(id) {
    try {
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        });
        
        if (res.ok) {
            fetchTasks();
        }
    } catch (err) {
        console.error("Error deleting task:", err);
    }
}

