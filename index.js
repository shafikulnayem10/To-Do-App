const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector("#inputTodo");
const todoLists = document.querySelector("#lists");
const messageElement = document.querySelector("#message");
const emptyState = document.querySelector("#emptyState");
const listHeader = document.querySelector("#listHeader");
const taskCount = document.querySelector("#taskCount");

const updateUI = () => {
    const count = todoLists.children.length;
    if (count === 0) {
        emptyState.classList.remove("hidden");
        listHeader.classList.remove("visible");
    } else {
        emptyState.classList.add("hidden");
        listHeader.classList.add("visible");
        taskCount.textContent = `${count} task${count !== 1 ? "s" : ""}`;
    }
};

const showMessage = (text, status) => {
    messageElement.textContent = text;
    messageElement.classList.add(`bg-${status}`);
    setTimeout(() => {
        messageElement.textContent = "";
        messageElement.classList.remove(`bg-${status}`);
    }, 2000);
};

const createTodo = (todoId, todoValue) => {
    const todoElement = document.createElement("li");
    todoElement.id = todoId;
    todoElement.classList.add("li-style");
    todoElement.innerHTML = `
        <span>${todoValue}</span>
        <button class="delete-btn" aria-label="Delete task">
            <i class="fa fa-trash"></i>
        </button>
    `;
    todoLists.appendChild(todoElement);
    todoElement.querySelector(".delete-btn").addEventListener("click", deleteTodo);
    updateUI();
};

const deleteTodo = (event) => {
    const selectedTodo = event.currentTarget.closest(".li-style");
    selectedTodo.style.transition = "all 0.25s ease";
    selectedTodo.style.opacity = "0";
    selectedTodo.style.transform = "translateX(20px)";
    setTimeout(() => {
        todoLists.removeChild(selectedTodo);
        const todos = getTodosFromLocalStorage().filter(t => t.todoId !== selectedTodo.id);
        localStorage.setItem("mytodos", JSON.stringify(todos));
        updateUI();
    }, 250);
    showMessage("Task deleted!", "danger");
};

const getTodosFromLocalStorage = () => {
    return localStorage.getItem("mytodos") ? JSON.parse(localStorage.getItem("mytodos")) : [];
};

const addTodo = (event) => {
    event.preventDefault();
    const todoValue = todoInput.value.trim();
    if (!todoValue) {
        todoInput.style.animation = "none";
        todoInput.offsetHeight;
        todoInput.focus();
        return;
    }
    const todoId = Date.now().toString();
    createTodo(todoId, todoValue);
    showMessage("Task added!", "success");
    const todos = getTodosFromLocalStorage();
    todos.push({ todoId, todoValue });
    localStorage.setItem("mytodos", JSON.stringify(todos));
    todoInput.value = "";
};

const loadTodos = () => {
    const todos = getTodosFromLocalStorage();
    todos.forEach(todo => createTodo(todo.todoId, todo.todoValue));
};

todoForm.addEventListener("submit", addTodo);
window.addEventListener("DOMContentLoaded", loadTodos);
