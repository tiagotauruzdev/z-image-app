// Arquivo de exemplo para demonstrar importação de tipos do backend
// Isso permite tipagem forte para comunicação com a API

import { getApiUrl } from './api';

// Importando tipos do serviço Z Image através do workspace
// Em desenvolvimento, o frontend pode importar tipos diretamente do backend
export type { CreateTaskResponse, TaskStatusResponse } from 'server/src/services/z-image-api';

// Tipos locais baseados nos schemas do backend
export interface CreateTaskRequest {
  prompt: string;
  aspectRatio?: '1:1' | '4:3' | '3:4' | '16:9' | '9:16';
}

export interface Task {
  id: string;
  prompt: string;
  aspectRatio: string;
  status: 'waiting' | 'success' | 'fail';
  taskId?: string;
  resultUrls?: string[];
  failureCode?: string;
  failureMessage?: string;
  createdAt: Date;
  completedAt?: Date;
  costTime?: number;
}

export interface TaskHistoryResponse {
  tasks: Task[];
  hasMore: boolean;
  nextCursor: null;
}

// Funções helper para comunicação com a API
export const apiClient = {
  async createTask(data: CreateTaskRequest): Promise<{ id: string; taskId: string }> {
    const response = await fetch(getApiUrl('/api/image/create'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    return response.json();
  },

  async getTaskStatus(id: string): Promise<Task> {
    const response = await fetch(getApiUrl(`/api/image/status/${id}`));

    if (!response.ok) {
      throw new Error('Failed to fetch task status');
    }

    return response.json();
  },

  async getHistory(limit: number = 20, offset: number = 0): Promise<TaskHistoryResponse> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await fetch(getApiUrl(`/api/image/history?${params}`));

    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }

    return response.json();
  },
};