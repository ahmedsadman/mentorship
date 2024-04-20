import { Hono } from "hono";
import userService from "../service/UserService";

const userApp = new Hono();

userApp.post("/", async (c) => {
  const { name, email } = await c.req.json();
  const newUser = await userService.createUser({ name, email });
  return c.json(newUser, 201);
});

export default userApp;
