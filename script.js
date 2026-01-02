let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");

function getTodoListFromLocalStorage() {
  let stringifiedTodoList = localStorage.getItem("todoList");
  let parsedTodoList = JSON.parse(stringifiedTodoList);
  return parsedTodoList === null ? [] : parsedTodoList;
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

saveTodoButton.onclick = function () {
  localStorage.setItem("todoList", JSON.stringify(todoList));
};

addTodoButton.onclick = function () {
  let userInputElement = document.getElementById("todoUserInput");
  let userInputValue = userInputElement.value;

  if (userInputValue === "") {
    alert("Enter Valid Text");
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
