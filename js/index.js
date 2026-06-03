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
        })
    }
}

loadAllTasks()

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

    pendingContainer.appendChild(createTaskElement(task, priority, deadline));

    taskInput.value = "";
    priorityInput.value = "top";
    deadlineInput.value = "";

})

pendingContainer.addEventListener("click", (event) => {

    const taskItem = event.target.parentElement;
    
    if (event.target.classList.contains("mark-done")) {

        const taskObj = tasksList.find(t => t.taskId === taskItem.id);

        if (taskObj) {

            taskObj.status = "completed";
            localStorage.setItem("tasksList", JSON.stringify(tasksList));

            const doneBtn = taskItem.querySelector(".mark-done")
            if (doneBtn) doneBtn.remove()

            pendingContainer.removeChild(taskItem)
            completedContainer.appendChild(taskItem)
        }
    }

    if (event.target.classList.contains("delete")) {

        pendingContainer.removeChild(taskItem)
        deleteTask(taskItem.id)

    }

})

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

        const doneBtn = dragged.querySelector(".mark-done")
        if (doneBtn) doneBtn.remove()

        pendingContainer.removeChild(dragged)
        completedContainer.appendChild(dragged)

    }

})

completedContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete")) {
        const taskItem = event.target.parentElement;
        completedContainer.removeChild(taskItem)
        deleteTask(taskItem.id)
    }
});

function createTaskElement(task, priority, deadline) {
    
    const taskId = crypto.randomUUID();

    const taskItem = document.createElement("div");
    taskItem.classList.add("task");
    taskItem.id = taskId;
    taskItem.draggable = true

    taskItem.innerHTML = `
        <p>${task}</p>
        <p>Priority: ${priority}</p>
        <p>Deadline: ${deadline}</p>
        <button class="mark-done">Mark Done</button>
        <button class="delete">Delete</button>
    `;
    
    const taskObj = {
        taskId,
        task,
        priority,
        deadline,
        status: "pending"
    };

    tasksList.push(taskObj);
    localStorage.setItem("tasksList", JSON.stringify(tasksList));

    return taskItem
}

function deleteTask(taskId) {
    const userConfirmation = confirm("Are you sure you want to delete task?")
    if (userConfirmation) {
        const index = tasksList.findIndex(t => t.taskId === taskId);
        if (index !== -1) {
            tasksList.splice(index, 1)
            localStorage.setItem("tasksList", JSON.stringify(tasksList))
        }
    }
}
