
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"), // 'admin' | 'student'
  phone: text("phone"),
  profilePicture: text("profile_picture"), // Base64 encoded image or URL
  verified: boolean("verified").default(false).notNull(),
  acceptedTerms: boolean("accepted_terms").default(false).notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  startTime: text("start_time").notNull(), // e.g. "18:00"
  endTime: text("end_time").notNull(),     // e.g. "20:00"
  instructor: text("instructor").notNull(),
  capacity: integer("capacity").notNull().default(20),
  description: text("description"),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Foreign key to users
  sessionId: integer("session_id").notNull(), // Foreign key to sessions
  status: text("status").notNull(), // 'present' | 'absent'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  authorId: integer("author_id").notNull(), // Foreign key to users
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, joinedAt: true });
export const updateUserSchema = createInsertSchema(users).omit({ id: true, email: true, password: true, joinedAt: true, role: true }).partial();
export const insertSessionSchema = createInsertSchema(sessions)
  .omit({ id: true })
  .extend({ date: z.string().or(z.date()).pipe(z.coerce.date()) });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true, timestamp: true });
export const insertAnnouncementSchema = createInsertSchema(announcements)
  .omit({ id: true, createdAt: true })
  .extend({
    title: z.string().min(1, "Title is required"),
    body: z.string().min(1, "Message body is required"),
    authorId: z.number(),
  });
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
