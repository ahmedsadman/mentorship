import { Hono } from "hono";
import { userApp } from "./routes";

const app = new Hono();

app.get("/ping", (c) => {
  return c.text("pong");
});

app.route("/user", userApp);

app.onError((err, c) => {
  console.log(err);
  return c.json(err, 500);
});

export default {
  ...app,
  port: process.env.PORT || 3000,
};
