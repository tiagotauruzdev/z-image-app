import { z } from "zod";

const createTaskResponseSchema = z.object({
  code: z.literal(200),
  msg: z.string(),
  data: z.object({
    taskId: z.string()
  })
});

const taskStatusResponseSchema = z.object({
  code: z.literal(200),
  msg: z.string(),
  data: z.object({
    taskId: z.string(),
    model: z.string(),
    state: z.enum(["waiting", "success", "fail"]),
    param: z.string(),
    resultJson: z.string().nullable(),
    failCode: z.string().nullable(),
    failMsg: z.string().nullable(),
    costTime: z.number().nullable(),
    completeTime: z.number().nullable(),
    createTime: z.number()
  })
});

export type CreateTaskResponse = z.infer<typeof createTaskResponseSchema>;
export type TaskStatusResponse = z.infer<typeof taskStatusResponseSchema>;

export class ZImageService {
  private baseUrl = process.env.Z_IMAGE_API_BASE_URL || "https://api.kie.ai";
  private token = process.env.Z_IMAGE_API_TOKEN!;

  async createTask(params: {
    prompt: string;
    aspectRatio: string;
    callBackUrl?: string;
  }): Promise<CreateTaskResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/jobs/createTask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.token}`
      },
      body: JSON.stringify({
        model: "z-image",
        input: {
          prompt: params.prompt,
          aspect_ratio: params.aspectRatio
        },
        callBackUrl: params.callBackUrl
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return createTaskResponseSchema.parse(data);
  }

  async getTaskStatus(taskId: string): Promise<TaskStatusResponse> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/jobs/recordInfo?taskId=${taskId}`,
      {
        headers: {
          "Authorization": `Bearer ${this.token}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return taskStatusResponseSchema.parse(data);
  }
}

export const zImageService = new ZImageService();