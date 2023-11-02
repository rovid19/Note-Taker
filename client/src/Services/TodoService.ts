import { todoStore } from "../Stores/TodoStore";
import Base from "./BaseService";

class Todo extends Base {
  constructor() {
    super("http://localhost:3000/api/todo");
  }

  async fetchTodo(userId: string) {
    const todo = await this.get("/fetch-user-todo", { userId });
    todoStore.set("todoList", todo);
  }

  async saveItem(userId: string, todoItem: string) {
    await this.put("/save-todo", { userId, todoItem });
  }
}

export const todoService = new Todo();
