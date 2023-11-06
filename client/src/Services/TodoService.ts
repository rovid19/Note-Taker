import { todoList, todoStore } from "../Stores/TodoStore";
import Base from "./BaseService";

class Todo extends Base {
  constructor() {
    super("http://localhost:3000/api/todo");
  }

  async fetchTodo(userId: string) {
    const todo = await this.get("/fetch-user-todo", { userId });
    todo.forEach((item) => todoList.addItem(item));
  }

  async saveItem(userId: string, todoItem: string) {
    await this.put("/save-todo", { userId, todoItem });
  }

  async deleteTask(userId: string, index: number) {
    await this.put("/delete-task", { userId, index });
  }
}

export const todoService = new Todo();
