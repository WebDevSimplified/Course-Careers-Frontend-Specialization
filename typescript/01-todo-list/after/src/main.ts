import "./styles.css"

type Todo = {
  id: string
  name: string
  complete: boolean
}

const form = document.querySelector<HTMLFormElement>("#new-todo-form")!
const todoInput = document.querySelector<HTMLInputElement>("#todo-input")!
const list = document.querySelector<HTMLUListElement>("#list")!

let todos = loadTodos()
todos.forEach(renderNewTodo)

form.addEventListener("submit", e => {
  e.preventDefault()

  const todoName = todoInput.value
  if (todoName === "") return
  const newTodo = {
    id: crypto.randomUUID(),
    name: todoName,
    complete: false,
  }

  todos.push(newTodo)
  renderNewTodo(newTodo)
  saveTodos()
  todoInput.value = ""
})

function renderNewTodo(todo: Todo) {
  const listItem = document.createElement("li")
  listItem.classList.add("list-item")

  const label = document.createElement("label")
  label.classList.add("list-item-label")

  const checkbox = document.createElement("input")
  checkbox.type = "checkbox"
  checkbox.checked = todo.complete
  checkbox.classList.add("label-input")
  checkbox.addEventListener("change", () => {
    todo.complete = checkbox.checked
    saveTodos()
  })

  const textElement = document.createElement("span")
  textElement.classList.add("label-text")
  textElement.innerText = todo.name

  const deleteButton = document.createElement("button")
  deleteButton.classList.add("delete-btn")
  deleteButton.innerText = "Delete"
  deleteButton.addEventListener("click", () => {
    listItem.remove()
    todos = todos.filter(t => t.id !== todo.id)
    saveTodos()
  })

  label.append(checkbox, textElement)
  listItem.append(label, deleteButton)
  list.append(listItem)
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos))
}

function loadTodos() {
  const value = localStorage.getItem("todos")
  if (value == null) return []
  return JSON.parse(value) as Todo[]
}
