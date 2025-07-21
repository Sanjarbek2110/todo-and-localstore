const todoForm = document.querySelector("#form");
const todoInput = document.querySelector("#input");
const todoBox = document.querySelector("#wrapper");

// 🧠 localStorage'dan malumotlarni olish
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// 🔁 Sayt yuklanganda mavjud todolarni render qilish
todos.forEach(todo => renderTodo(todo));

// 📥 Submit hodisasi
todoForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const inputValue = todoInput.value.trim();
    if (!inputValue) return;

    const todo = {
        id: Date.now(),
        text: inputValue,
        completed: false
    };

    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodo(todo);

    todoInput.value = "";
});

// 📤 Todo'ni DOMga qo‘shish funksiyasi
function renderTodo(todo) {
    const newLi = document.createElement("li");
    newLi.className = "w-[500px] bg-slate-400 rounded p-[20px] flex items-center justify-between mb-3";
    newLi.setAttribute("data-id", todo.id);

    newLi.innerHTML = `
        <div class="flex items-center gap-1">
            <input class="checkbox" type="checkbox" ${todo.completed ? "checked" : ""}/>
            <h2 class="font-bold text-[25px]" style="text-decoration:${todo.completed ? "line-through" : "none"}">${todo.text}</h2>
        </div>
        <div>
            <button class="edit btn btn-success">Edit</button>
            <button class="delete btn btn-error">Delete</button>
        </div>
    `;

    const deleteBtn = newLi.querySelector(".delete");
    const editBtn = newLi.querySelector(".edit");
    const checkbox = newLi.querySelector(".checkbox");
    const textt = newLi.querySelector("h2");

    // ✅ Checkbox hodisasi
    checkbox.addEventListener("change", () => {
        const id = Number(newLi.getAttribute("data-id"));
        const todoItem = todos.find(t => t.id === id);
        todoItem.completed = checkbox.checked;
        textt.style.textDecoration = checkbox.checked ? "line-through" : "none";
        editBtn.style.cursor = checkbox.checked ? "no-drop" : "pointer";
        deleteBtn.style.cursor = checkbox.checked ? "no-drop" : "pointer";
        localStorage.setItem("todos", JSON.stringify(todos));
    });

    // 🗑 Delete hodisasi
    deleteBtn.addEventListener("click", () => {
        const id = Number(newLi.getAttribute("data-id"));
        todos = todos.filter(t => t.id !== id);
        localStorage.setItem("todos", JSON.stringify(todos));
        newLi.remove();
    });

    // 📝 Edit hodisasi
    editBtn.addEventListener("click", () => {
        if (checkbox.checked) return; // tahrir faqat belgilanmagan task uchun
        const newText = prompt("Yangi matn kiriting:", textt.textContent);
        if (newText && newText.trim() !== "") {
            const id = Number(newLi.getAttribute("data-id"));
            const todoItem = todos.find(t => t.id === id);
            todoItem.text = newText.trim();
            textt.textContent = newText.trim();
            localStorage.setItem("todos", JSON.stringify(todos));
        }
    });

    todoBox.appendChild(newLi);
}
