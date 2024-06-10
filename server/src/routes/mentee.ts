import menteeService from "@app/service/MenteeService";
import sessionService from "@app/service/SessionService";
import { Hono } from "hono";

const menteeApp = new Hono();

menteeApp.post("/", async (c) => {
  const { name, email, password, plan, price } = await c.req.json();
  const newMentee = await menteeService.createMentee({
    name,
    email,
    password,
    plan,
    price,
  });
  return c.json(newMentee, 201);
});

menteeApp.post("/:id/session", async (c) => {
  const { startTime, endTime } = await c.req.json();
  const { id } = c.req.param();
  const session = await sessionService.createSession({
    menteeId: Number(id),
    startTime: new Date(startTime),
    endTime: new Date(endTime),
  });

  return c.json(session, 201);
});

menteeApp.get("/:id/session", async (c) => {
  const { id } = c.req.param();
  const sessions = await sessionService.getMenteeSessions(Number(id));
  return c.json(sessions, 200);
});

export default menteeApp;
