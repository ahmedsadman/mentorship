import { Hono } from "hono";
import { menteeApp, userApp } from "./routes";

const app = new Hono();

app.get("/ping", (c) => {
  return c.text("pong");
});

app.route("/user", userApp);
app.route("/mentee", menteeApp);

app.onError((err, c) => {
  console.log(err);
  return c.json({ err: err.message }, 500);
});

export default {
  ...app,
  port: process.env.PORT || 3000,
};
