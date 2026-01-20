
import { 
  users, sessions, attendance, announcements, contacts,
  type User, type InsertUser, type UpdateUser, type Session, type InsertSession, 
  type Attendance, type InsertAttendance, type Announcement, 
  type InsertAnnouncement, type Contact, type InsertContact 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUser(id: number, updates: UpdateUser): Promise<User>;
  deleteUser(id: number): Promise<void>;
  changePassword(id: number, newHashedPassword: string): Promise<User>;
  
  getSessions(): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  deleteSession(id: number): Promise<void>;
  
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  deleteAnnouncement(id: number): Promise<void>;
  
  getAttendance(userId?: number): Promise<Attendance[]>;
  markAttendance(attendance: InsertAttendance): Promise<Attendance>;
  
  createContact(contact: InsertContact): Promise<Contact>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.joinedAt));
  }

  async updateUser(id: number, updates: UpdateUser): Promise<User> {
    const [user] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async changePassword(id: number, newHashedPassword: string): Promise<User> {
    const [user] = await db.update(users)
      .set({ password: newHashedPassword })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getSessions(): Promise<Session[]> {
    return await db.select().from(sessions).orderBy(sessions.date);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await db.insert(sessions).values(insertSession).returning();
    return session;
  }

  async deleteSession(id: number): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, id));
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db.insert(announcements).values(insertAnnouncement).returning();
    return announcement;
  }

  async deleteAnnouncement(id: number): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }

  async getAttendance(userId?: number): Promise<Attendance[]> {
    if (userId) {
      return await db.select().from(attendance).where(eq(attendance.userId, userId)).orderBy(desc(attendance.timestamp));
    }
    return await db.select().from(attendance).orderBy(desc(attendance.timestamp));
  }

  async markAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const [record] = await db.insert(attendance).values(insertAttendance).returning();
    return record;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }
}

export const storage = new DatabaseStorage();
