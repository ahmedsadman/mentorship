import { Hono } from "hono";
import UserRepo from "./repo/UserRepo";

const app = new Hono();

app.post("/user", async (c) => {
	const { name, email } = await c.req.json();
	const newUser = await UserRepo.create({ name, email });
	return c.json(newUser);
});

app.onError((err, c) => {
	console.log(err);
	return c.json(err);
});

export default app;
