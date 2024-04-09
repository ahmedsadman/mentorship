import { Hono } from "hono";
import UserRepo from "./repo/UserRepo";

const app = new Hono();

app.get("/ping", (c) => {
	return c.text("pong");
});

app.post("/user", async (c) => {
	const { name, email } = await c.req.json();
	const newUser = await UserRepo.create({ name, email });
	return c.json(newUser, 201);
});

app.onError((err, c) => {
	console.log(err);
	return c.json(err, 500);
});

export default {
	...app,
	port: process.env.PORT || 3000,
};
