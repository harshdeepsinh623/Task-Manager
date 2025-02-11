const taskList = document.getElementById("taskList");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskDueDate = document.getElementById("taskDueDate");
const taskPriority = document.getElementById("taskPriority");
const filterPriority = document.getElementById("filterPriority");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
    const text = taskTitle.value.trim();
    
    if (!text) {
        showError("Please enter a valid task title!");
        return;
    }

    const task = {
        text,
        description: taskDescription.value.trim() || "No description",
        dueDate: taskDueDate.value || "No due date",
        priority: taskPriority.value || "medium",
        completed: false,
    };

    tasks.push(task);
    saveTasks();
    clearForm();
    renderTasks(filterPriority?.value || "all");
}

function clearForm() {
    taskTitle.value = "";
    taskDescription.value = "";
    taskDueDate.value = "";
    taskPriority.value = "medium";
}

function showError(message) {
    const errorMessage = document.querySelector(".error-message");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";

    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 3000);
}

function renderTasks(filter) {
    taskList.innerHTML = "";

    tasks
        .filter(task => filter === "all" || task.priority === filter)
        .forEach((task, index) => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";

            listItem.innerHTML = `
                <div>
                    <strong>${task.text}</strong> - ${task.description}
                    <br> Due: ${task.dueDate} | Priority: <span class="badge bg-${getPriorityColor(task.priority)}">${task.priority}</span>
                </div>
                <div>
                    <button onclick="editTask(${index})" class="btn btn-sm btn-info">✏️</button>
                    <button onclick="deleteTask(${index})" class="btn btn-sm btn-danger">🗑️</button>
                </div>
            `;

            taskList.appendChild(listItem);
        });
}

function getPriorityColor(priority) {
    switch (priority) {
        case "high": return "danger";
        case "medium": return "warning";
        case "low": return "success";
        default: return "secondary";
    }
}   

function editTask(index) {
    const newTitle = prompt("Edit Task Title:", tasks[index].text);
    const newDescription = prompt("Edit Description:", tasks[index].description);
    const newDueDate = prompt("Edit Due Date:", tasks[index].dueDate);
    const newPriority = prompt("Edit Priority (low, medium, high):", tasks[index].priority);

    if (newTitle) tasks[index].text = newTitle.trim();
    if (newDescription) tasks[index].description = newDescription.trim();
    if (newDueDate) tasks[index].dueDate = newDueDate.trim();
    if (newPriority) tasks[index].priority = newPriority.trim();

    saveTasks();
    renderTasks(filterPriority?.value || "all");
}

function deleteTask(index) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(filterPriority?.value || "all");
    }
}

function clearTasks() {
    if (confirm("Are you sure you want to clear all tasks?")) {
        tasks = [];
        saveTasks();
        renderTasks("all");
    }
}

function sortTasks() {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
    saveTasks();
    renderTasks(filterPriority?.value || "all");
}

function prioritizeTask() {
    const priorityTask = prompt("Enter the task title to prioritize:");
    if (!priorityTask) return;

    const foundIndex = tasks.findIndex(task => task.text === priorityTask.trim());
    if (foundIndex > -1) {
        const [task] = tasks.splice(foundIndex, 1);
        tasks.unshift(task);
        saveTasks();
        renderTasks(filterPriority?.value || "all");
    } else {
        alert("Task not found!");
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.addEventListener("DOMContentLoaded", () => {
    renderTasks("all");

    document.getElementById("taskForm").addEventListener("submit", (e) => {
        e.preventDefault();
        addTask();
    });

    filterPriority?.addEventListener("change", (e) => renderTasks(e.target.value));
});