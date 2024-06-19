import menteeService from "@app/service/MenteeService";
import { Hono } from "hono";

const webhookApp = new Hono();

webhookApp.post("/session", async (c) => {
  const data = await c.req.json();
  await menteeService.handleWebhookSession(data);
  return c.text("", 200);
});

export default webhookApp;
