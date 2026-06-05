let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");

let messageTimeouts = {};

function showStatusMessage(elementId, message, type = "success") {
  let messageElement = document.getElementById(elementId);
  if (!messageElement) return;

  // Clear any existing active timeout for this element
  if (messageTimeouts[elementId]) {
    clearTimeout(messageTimeouts[elementId]);
  }

  // Remove existing type classes
  messageElement.classList.remove("success", "warning", "info", "show");

  // Determine icon class based on type
  let iconClass = "fa-circle-check";
  if (type === "warning") {
    iconClass = "fa-circle-exclamation";
  } else if (type === "info") {
    iconClass = "fa-circle-info";
  }

  // Set the message content with icon
  messageElement.innerHTML = `<i class="fa-solid ${iconClass} status-icon"></i> <span>${message}</span>`;
  messageElement.classList.add(type);

  // Trigger reflow to restart transition
  messageElement.offsetHeight;

  // Add the show class
  messageElement.classList.add("show");

  // Hide the message after 3 seconds
  messageTimeouts[elementId] = setTimeout(() => {
    messageElement.classList.remove("show");
  }, 3000);
}

function getTodoListFromLocalStorage() {
  let stringifiedTodoList = localStorage.getItem("todoList");
  let parsedTodoList = JSON.parse(stringifiedTodoList);
  return parsedTodoList === null ? [] : parsedTodoList;
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

saveTodoButton.onclick = function () {
  localStorage.setItem("todoList", JSON.stringify(todoList));
  showStatusMessage("saveMessage", "Tasks saved successfully!", "success");
};

addTodoButton.onclick = function () {
  let userInputElement = document.getElementById("todoUserInput");
  let userInputValue = userInputElement.value;

  if (userInputValue === "") {
    showStatusMessage("addMessage", "Please enter a valid task name!", "warning");
    return;
  }

  todosCount++;

  let newTodo = {
    text: userInputValue,
    uniqueNo: todosCount,
    isChecked: false,
  };

  todoList.push(newTodo);
  createAndAppendTodo(newTodo);
  userInputElement.value = "";
  showStatusMessage("addMessage", "Task added successfully!", "success");
};

function onTodoStatusChange(checkboxId, labelId, todoId) {
  let labelElement = document.getElementById(labelId);
  labelElement.classList.toggle("checked");

  let todoObject = todoList.find(
    (todo) => "todo" + todo.uniqueNo === todoId
  );
  todoObject.isChecked = !todoObject.isChecked;
}

function onDeleteTodo(todoId) {
  let todoElement = document.getElementById(todoId);
  todoItemsContainer.removeChild(todoElement);

  todoList = todoList.filter(
    (todo) => "todo" + todo.uniqueNo !== todoId
  );
}

function createAndAppendTodo(todo) {
  let todoId = "todo" + todo.uniqueNo;
  let checkboxId = "checkbox" + todo.uniqueNo;
  let labelId = "label" + todo.uniqueNo;

  let todoElement = document.createElement("li");
  todoElement.classList.add("todo-item-container", "d-flex");
  todoElement.id = todoId;

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = checkboxId;
  checkbox.checked = todo.isChecked;
  checkbox.classList.add("checkbox-input");
  checkbox.onclick = function () {
    onTodoStatusChange(checkboxId, labelId, todoId);
  };

  let labelContainer = document.createElement("div");
  labelContainer.classList.add("label-container", "d-flex");

  let label = document.createElement("label");
  label.id = labelId;
  label.textContent = todo.text;
  label.classList.add("checkbox-label");
  if (todo.isChecked) label.classList.add("checked");

  let deleteContainer = document.createElement("div");
  deleteContainer.classList.add("delete-icon-container");

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");
  deleteIcon.onclick = function () {
    onDeleteTodo(todoId);
  };

  deleteContainer.appendChild(deleteIcon);
  labelContainer.append(label, deleteContainer);
  todoElement.append(checkbox, labelContainer);
  todoItemsContainer.appendChild(todoElement);
}

todoList.forEach(createAndAppendTodo);
