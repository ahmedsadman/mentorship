import menteeService from "@app/service/MenteeService";
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

export default menteeApp;
