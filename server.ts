import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // RSVP Routes
  app.post("/api/rsvp", (req, res) => {
    try {
      const { name, attendees, message } = req.body;
      const stmt = db.prepare('INSERT INTO rsvps (name, attendees, message) VALUES (?, ?, ?)');
      const info = stmt.run(name, attendees, message);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
      console.error('RSVP Error:', error);
      res.status(500).json({ error: 'Failed to save RSVP' });
    }
  });

  app.get("/api/rsvp", (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM rsvps ORDER BY created_at DESC');
      const rsvps = stmt.all();
      res.json(rsvps);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch RSVPs' });
    }
  });

  // Guestbook Routes
  app.post("/api/guestbook", (req, res) => {
    try {
      const { name, message } = req.body;
      const stmt = db.prepare('INSERT INTO guestbook (name, message) VALUES (?, ?)');
      const info = stmt.run(name, message);
      res.json({ success: true, id: info.lastInsertRowid, entry: { id: info.lastInsertRowid, name, message, created_at: new Date().toISOString() } });
    } catch (error) {
      console.error('Guestbook Error:', error);
      res.status(500).json({ error: 'Failed to save message' });
    }
  });

  app.get("/api/guestbook", (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM guestbook ORDER BY created_at DESC');
      const messages = stmt.all();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch guestbook' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving would go here
    app.use(express.static('dist'));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
