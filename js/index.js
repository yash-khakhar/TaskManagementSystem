const tasksList = JSON.parse(localStorage.getItem("tasksList")) || [];

const taskInput = document.getElementById("task");
const priorityInput = document.getElementById("priority");
const deadlineInput = document.getElementById("deadline");
const addTaskButton = document.getElementById("add-task");

const pendingContainer = document.querySelector("#pending-list .tasks-container");
const completedContainer = document.querySelector("#completed-list .tasks-container");

function loadAllTasks() {
    
    pendingContainer.innerHTML = "";
    completedContainer.innerHTML = "";

    if (tasksList.length > 0) {
        tasksList.forEach(taskObj => {

            const taskItem = document.createElement("div");
            taskItem.classList.add("task");
            taskItem.id = taskObj.taskId;
            taskItem.draggable = true
            
            const isPending = taskObj.status === 'pending';
            
            taskItem.innerHTML = `
                <p>${taskObj.task}</p>
                <p>Priority: ${taskObj.priority}</p>
                <p>Deadline: ${taskObj.deadline}</p>
                ${isPending ? '<button class="mark-done">Mark Done</button>' : ''}
                <button class="delete">Delete</button>
            `;

            if (isPending) {
                pendingContainer.appendChild(taskItem);
            } else {
                taskItem.style.backgroundColor = "#f2f2f2";
                completedContainer.appendChild(taskItem);
            }
        });
    }
}

loadAllTasks();

addTaskButton.addEventListener("click", () => {
    const task = taskInput.value.trim();
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    if (task === "") {
        alert("Please enter a proper task name.");
        return; 
    }

    if (deadline.trim() === "") {
        alert("Please select an upcoming date for the deadline.");
        return;
    }

    const selectedDate = new Date(deadline);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); 

    if (selectedDate < currentDate) {
        alert("Please select an upcoming date for the deadline.");
        return; 
    }

    createTaskElement(task, priority, deadline);
    loadAllTasks();

    taskInput.value = "";
    priorityInput.value = "top";
    deadlineInput.value = "";

});

pendingContainer.addEventListener("click", (event) => {
    const taskItem = event.target.parentElement;
    
    if (event.target.classList.contains("mark-done")) {
        const taskObj = tasksList.find(t => t.taskId === taskItem.id);
        if (taskObj) {
            taskObj.status = "completed";
            localStorage.setItem("tasksList", JSON.stringify(tasksList));
            loadAllTasks();
        }
    }

    if (event.target.classList.contains("delete")) {
        deleteTask(taskItem);
    }
});

let dragged;

pendingContainer.addEventListener("dragstart", (event) => {
    dragged = event.target
})

completedContainer.addEventListener("dragover", (event) => {
    event.preventDefault()
})

completedContainer.addEventListener("drop", (event) => {
    
    event.preventDefault();
    const taskObj = tasksList.find(t => t.taskId === dragged.id)
    if (taskObj) {
        taskObj.status = "completed"
        localStorage.setItem("tasksList", JSON.stringify(tasksList))
        loadAllTasks()
    }

})

completedContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete")) {
        const taskItem = event.target.parentElement;
        deleteTask(taskItem);
    }
});

function createTaskElement(task, priority, deadline) {
    const taskId = crypto.randomUUID();
    
    const taskObj = {
        taskId,
        task,
        priority,
        deadline,
        status: "pending"
    };

    tasksList.push(taskObj);
    localStorage.setItem("tasksList", JSON.stringify(tasksList));
}

function deleteTask(taskItem) {
    const userConfirmation = confirm("Are you sure you want to delete task?");
    if (userConfirmation) {
        const index = tasksList.findIndex(t => t.taskId === taskItem.id);
        if (index !== -1) {
            tasksList.splice(index, 1);
            localStorage.setItem("tasksList", JSON.stringify(tasksList));
            loadAllTasks();
        }
    }
}
