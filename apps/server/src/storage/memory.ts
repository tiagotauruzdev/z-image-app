// Storage centralizado em memória para tasks de geração de imagem

export interface Task {
  id: string;
  taskId: string;
  prompt: string;
  aspectRatio: string;
  status: "waiting" | "success" | "fail";
  resultUrls?: string[];
  failureCode?: string;
  failureMessage?: string;
  costTime?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

class MemoryStorage {
  private tasks = new Map<string, Task>();

  // Criar nova task
  createTask(task: Omit<Task, "id" | "taskId" | "status" | "createdAt" | "updatedAt">): Task {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newTask: Task = {
      ...task,
      id,
      taskId: "",
      status: "waiting",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  // Atualizar task por ID
  updateTask(id: string, updates: Partial<Task>): Task | null {
    const task = this.tasks.get(id);
    if (!task) return null;

    const updatedTask = { ...task, ...updates, updatedAt: new Date() };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  // Buscar task por ID
  getTask(id: string): Task | null {
    return this.tasks.get(id) || null;
  }

  // Buscar task por taskId da API
  getTaskByApiId(apiTaskId: string): Task | null {
    for (const task of this.tasks.values()) {
      if (task.taskId === apiTaskId) {
        return task;
      }
    }
    return null;
  }

  // Listar tasks com paginação
  listTasks(limit = 20, offset = 0): Task[] {
    return Array.from(this.tasks.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  // Atualizar taskId da API
  updateTaskApiId(id: string, apiTaskId: string): Task | null {
    const task = this.tasks.get(id);
    if (!task) return null;

    task.taskId = apiTaskId;
    task.updatedAt = new Date();
    this.tasks.set(id, task);
    return task;
  }
}

export const memoryStorage = new MemoryStorage();