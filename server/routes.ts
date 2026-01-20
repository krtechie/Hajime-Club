
import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  // Sessions
  app.get(api.sessions.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const sessions = await storage.getSessions();
    res.json(sessions);
  });

  app.post(api.sessions.create.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') return res.sendStatus(403);
    const input = api.sessions.create.input.parse(req.body);
    const session = await storage.createSession(input);
    res.status(201).json(session);
  });

  app.delete(api.sessions.delete.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') return res.sendStatus(403);
    await storage.deleteSession(parseInt(req.params.id));
    res.sendStatus(204);
  });

  // Announcements
  app.get(api.announcements.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const announcements = await storage.getAnnouncements();
    res.json(announcements);
  });

  app.post(api.announcements.create.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') return res.sendStatus(403);
    const input = api.announcements.create.input.parse(req.body);
    const announcement = await storage.createAnnouncement(input);
    res.status(201).json(announcement);
  });

  // Attendance
  app.get(api.attendance.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    const userId = user.role === 'admin' ? undefined : user.id;
    const attendance = await storage.getAttendance(userId);
    res.json(attendance);
  });

  app.post(api.attendance.mark.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const input = api.attendance.mark.input.parse(req.body);
    // Students can only mark their own attendance
    if ((req.user as any).role !== 'admin' && input.userId !== (req.user as any).id) {
      return res.sendStatus(403);
    }
    const record = await storage.markAttendance(input);
    res.status(201).json(record);
  });

  // Admin Users
  app.get(api.admin.users.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') return res.sendStatus(403);
    const users = await storage.getUsers();
    res.json(users);
  });

  app.patch(api.admin.updateUser.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    const targetId = parseInt(req.params.id);
    // Users can only update their own profile, admins can update anyone
    if (user.role !== 'admin' && user.id !== targetId) return res.sendStatus(403);
    const input = api.admin.updateUser.input.parse(req.body);
    const updated = await storage.updateUser(targetId, input);
    res.json(updated);
  });

  app.delete(api.admin.deleteUser.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') return res.sendStatus(403);
    await storage.deleteUser(parseInt(req.params.id));
    res.sendStatus(204);
  });

  app.post(api.admin.verifyUser.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') return res.sendStatus(403);
    const updated = await storage.updateUser(parseInt(req.params.id), { verified: true });
    res.json(updated);
  });

  // Announcements - Delete
  app.delete(api.announcements.delete.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') return res.sendStatus(403);
    await storage.deleteAnnouncement(parseInt(req.params.id));
    res.sendStatus(204);
  });

  // Contact
  app.post(api.contact.create.path, async (req, res) => {
    const input = api.contact.create.input.parse(req.body);
    const contact = await storage.createContact(input);
    res.status(201).json(contact);
  });

  return httpServer;
}
