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

// INTERNAL
menteeApp.post("/:id/session", async (c) => {
  const { startTime, endTime, length, bookingId } = await c.req.json();
  const { id } = c.req.param();
  const session = await sessionService.createSession({
    menteeId: Number(id),
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    length,
    status: "accepted",
    bookingId,
  });

  return c.json(session, 201);
});

// INTERNAL
menteeApp.patch("/:id/session/:bookingId", async (c) => {
  const { bookingId } = c.req.param();
  const { status } = await c.req.json();
  const deletedSession = await sessionService.updateSession(Number(bookingId), {
    status,
  });
  return c.json(deletedSession, 200);
});

menteeApp.get("/:id/session", async (c) => {
  const { id } = c.req.param();
  const sessions = await sessionService.getMenteeSessions(Number(id));
  return c.json(sessions, 200);
});

menteeApp.get("/session/search", async (c) => {
  const { email } = c.req.query();
  const result = await sessionService.searchSession({ email });
  return c.json(result, 200);
});

export default menteeApp;
