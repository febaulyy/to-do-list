document.addEventListener('DOMContentLoaded', getTodos);
document.querySelector('.todo-button').addEventListener('click', addTodo);
document.querySelector('.filter-todo').addEventListener('change', filterTodo);
document.querySelector('.todo-List').addEventListener('click', deleteOrCompleteTodo);

function addTodo(event) {
    event.preventDefault();
    const todoInput = document.querySelector('.todo-input');
    const todoText = todoInput.value;
    if (todoText === '') return;

    const todo = {
        text: todoText,
        completed: false,
        date: new Date().toISOString().split('T')[0]  // Format: YYYY-MM-DD
    };

    saveTodoToLocalStorage(todo);
    displayTodoInList(todo);
    todoInput.value = '';
}

function saveTodoToLocalStorage(todo) {
    let todos = getTodosFromLocalStorage();
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodosFromLocalStorage() {
    const todos = localStorage.getItem('todos');
    return todos ? JSON.parse(todos) : [];
}

function getTodos() {
    const todos = getTodosFromLocalStorage();
    todos.forEach(todo => displayTodoInList(todo));
}

function displayTodoInList(todo) {
    const todoList = document.querySelector('.todo-List');
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-item');
    
    todoItem.innerHTML = `
        <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
        <button class="complete-btn">Complete</button>
        <button class="delete-btn">Delete</button>
        <span class="todo-date">${todo.date}</span>
    `;
    
    todoList.appendChild(todoItem);
}

function deleteOrCompleteTodo(event) {
    const item = event.target;
    const todoItem = item.parentElement;
    const todoText = todoItem.querySelector('.todo-text').innerText;

    if (item.classList.contains('delete-btn')) {
        deleteTodoFromLocalStorage(todoText);
        todoItem.remove();
    } else if (item.classList.contains('complete-btn')) {
        toggleCompleteTodoInLocalStorage(todoText);
        todoItem.querySelector('.todo-text').classList.toggle('completed');
    }
}

function deleteTodoFromLocalStorage(todoText) {
    let todos = getTodosFromLocalStorage();
    todos = todos.filter(todo => todo.text !== todoText);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function toggleCompleteTodoInLocalStorage(todoText) {
    let todos = getTodosFromLocalStorage();
    todos = todos.map(todo => 
        todo.text === todoText ? { ...todo, completed: !todo.completed } : todo
    );
    localStorage.setItem('todos', JSON.stringify(todos));
}

function filterTodo() {
    const filterValue = document.querySelector('.filter-todo').value;
    const todoItems = document.querySelectorAll('.todo-item');

    todoItems.forEach(item => {
        const todoText = item.querySelector('.todo-text').innerText;
        const todoDate = item.querySelector('.todo-date').innerText;
        const todoCompleted = item.querySelector('.todo-text').classList.contains('completed');

        if (filterValue === 'all') {
            item.style.display = 'flex';
        } else if (filterValue === 'completed') {
            item.style.display = todoCompleted ? 'flex' : 'none';
        } else if (filterValue === 'uncompleted') {
            item.style.display = !todoCompleted ? 'flex' : 'none';
        }
    });
}
