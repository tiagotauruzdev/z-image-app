import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { zImageService } from "../services/z-image-api";
import { memoryStorage } from "../storage/memory";

const createTaskSchema = z.object({
  prompt: z.string().min(1).max(1000),
  aspectRatio: z.enum(["1:1", "4:3", "3:4", "16:9", "9:16"]).default("1:1"),
});

export const imageGenerationRouter = new Hono()
  .post("/create", zValidator("json", createTaskSchema), async (c) => {
    const validatedData = c.req.valid("json");

    try {
      // Criar task em memória
      const task = memoryStorage.createTask({
        prompt: validatedData.prompt,
        aspectRatio: validatedData.aspectRatio,
      });

      // Criar task na Z Image API
      const apiResponse = await zImageService.createTask({
        prompt: validatedData.prompt,
        aspectRatio: validatedData.aspectRatio,
        callBackUrl: `${process.env.CORS_ORIGIN || "http://localhost:3000"}/api/webhook/z-image`
      });

      // Atualizar com taskId da API
      memoryStorage.updateTaskApiId(task.id, apiResponse.data.taskId);

      return c.json({
        id: task.id,
        taskId: apiResponse.data.taskId
      });
    } catch (error) {
      console.error("Error creating task:", error);
      return c.json(
        { error: "Failed to create task", details: error.message },
        500
      );
    }
  })

  .get("/status/:id", async (c) => {
    const id = c.req.param("id");

    try {
      let task = memoryStorage.getTask(id);

      if (!task) {
        return c.json({ error: "Task not found" }, 404);
      }

      // Poll API se ainda estiver waiting e tiver taskId
      if (task.status === "waiting" && task.taskId) {
        try {
          const apiStatus = await zImageService.getTaskStatus(task.taskId);

          // Atualizar task com status da API
          const updateData: any = {
            status: apiStatus.data.state,
          };

          if (apiStatus.data.state === "success") {
            const result = JSON.parse(apiStatus.data.resultJson || "{}");
            updateData.resultUrls = result.resultUrls || [];
            updateData.completedAt = new Date(apiStatus.data.completeTime ? apiStatus.data.completeTime : Date.now());
            updateData.costTime = apiStatus.data.costTime;
          } else if (apiStatus.data.state === "fail") {
            updateData.failureCode = apiStatus.data.failCode;
            updateData.failureMessage = apiStatus.data.failMsg;
            updateData.completedAt = new Date();
          }

          task = memoryStorage.updateTask(id, updateData) || task;
        } catch (error) {
          console.error("Error polling API:", error);
          // Continuar com status atual mesmo se falhar polling
        }
      }

      return c.json(task);
    } catch (error) {
      console.error("Error fetching task status:", error);
      return c.json(
        { error: "Failed to fetch task status" },
        500
      );
    }
  })

  .get("/history", async (c) => {
    try {
      const limit = parseInt(c.req.query("limit") || "20");
      const offset = parseInt(c.req.query("offset") || "0");

      const tasks = memoryStorage.listTasks(limit, offset);

      return c.json({
        tasks: tasks,
        hasMore: false,
        nextCursor: null
      });
    } catch (error) {
      console.error("Error fetching history:", error);
      return c.json(
        { error: "Failed to fetch history" },
        500
      );
    }
  });