import { Hono } from "hono";
import { z } from "zod";
import { memoryStorage } from "../storage/memory";

const taskStatusResponseSchema = z.object({
  code: z.number(),
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

export const webhookRouter = new Hono()
  .post("/z-image", async (c) => {
    try {
      const body = await c.req.json();
      const validatedData = taskStatusResponseSchema.parse(body);

      // Encontrar task pelo taskId da API
      const task = memoryStorage.getTaskByApiId(validatedData.data.taskId);

      if (!task) {
        return c.json({ error: "Task not found" }, 404);
      }

      // Atualizar status
      const updateData: any = {
        status: validatedData.data.state,
      };

      if (validatedData.data.state === "success") {
        const result = JSON.parse(validatedData.data.resultJson || "{}");
        updateData.resultUrls = result.resultUrls || [];
        updateData.completedAt = new Date(validatedData.data.completeTime ? validatedData.data.completeTime : Date.now());
        updateData.costTime = validatedData.data.costTime;
      } else if (validatedData.data.state === "fail") {
        updateData.failureCode = validatedData.data.failCode;
        updateData.failureMessage = validatedData.data.failMsg;
        updateData.completedAt = new Date();
      }

      memoryStorage.updateTask(task.id, updateData);

      return c.json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error);
      return c.json({ error: "Invalid webhook data", details: error.message }, 400);
    }
  });