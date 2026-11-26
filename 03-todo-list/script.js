// All tasks are stored in this array. Each task: { text: "...", done: false }
let tasks = [];

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Add a new task
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") {
    alert("Please enter a task");
    return;
  }
  tasks.push({ text: text, done: false });
  taskInput.value = "";
  showTasks();
}

// Delete the task at the given position
function deleteTask(index) {
  tasks.splice(index, 1);
  showTasks();
}

// Swap a task with the one above it
function moveUp(index) {
  if (index === 0) return;
  const temp = tasks[index];
  tasks[index] = tasks[index - 1];
  tasks[index - 1] = temp;
  showTasks();
}

// Swap a task with the one below it
function moveDown(index) {
  if (index === tasks.length - 1) return;
  const temp = tasks[index];
  tasks[index] = tasks[index + 1];
  tasks[index + 1] = temp;
  showTasks();
}

// Flip done / not done
function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  showTasks();
}

// Draw the whole list again from the tasks array
function showTasks() {
  taskList.innerHTML = "";

  tasks.forEach(function (task, index) {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", function () { toggleTask(index); });

    const text = document.createElement("span");
    text.textContent = task.text;

    const upBtn = document.createElement("button");
    upBtn.textContent = "Up";
    upBtn.addEventListener("click", function () { moveUp(index); });

    const downBtn = document.createElement("button");
    downBtn.textContent = "Down";
    downBtn.addEventListener("click", function () { moveDown(index); });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", function () { deleteTask(index); });

    li.append(checkbox, text, upBtn, downBtn, delBtn);
    taskList.appendChild(li);
  });
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addTask();
});
