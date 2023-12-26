import { todoList, todoStore } from "../Stores/TodoStore";
import { TodoItem } from "../Utils/TsTypes";
import Base from "./BaseService";

class Todo extends Base {
  constructor() {
    super(`https://note-editor-client.up.railway.app/api/todo`);
  }

  async fetchTodo(userId: string) {
    const todo = await this.get("/fetch-user-todo", { userId });
    todo.forEach((item: TodoItem) => todoList.addItem(item));
  }

  async createItem(userId: string, todoItem: TodoItem) {
    await this.put("/create-todo-item", { userId, todoItem });
  }

  async saveItem(todoItem: TodoItem) {
    todoStore.set("todoSave", true);
    await this.put("/save-item", { todoItem });
    todoStore.set("todoSave", false);
  }

  async deleteTask(todoItemId: string) {
    await this.put("/delete-task", { todoItemId });
  }
}

export const todoService = new Todo();
