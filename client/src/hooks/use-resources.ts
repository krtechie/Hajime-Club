import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertSession, type InsertAnnouncement, type InsertContact, type InsertAttendance } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// SESSIONS
export function useSessions() {
  return useQuery({
    queryKey: [api.sessions.list.path],
    queryFn: async () => {
      const res = await fetch(api.sessions.list.path);
      if (!res.ok) throw new Error("Failed to fetch sessions");
      return await res.json();
    },
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertSession) => {
      const res = await fetch(api.sessions.create.path, {
        method: api.sessions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create session");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sessions.list.path] });
      toast({ title: "Success", description: "Session created successfully" });
    },
    onError: () => toast({ title: "Error", description: "Failed to create session", variant: "destructive" }),
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.sessions.delete.path, { id });
      const res = await fetch(url, { method: api.sessions.delete.method });
      if (!res.ok) throw new Error("Failed to delete session");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.sessions.list.path] });
      toast({ title: "Success", description: "Session deleted" });
    },
  });
}

// ANNOUNCEMENTS
export function useAnnouncements() {
  return useQuery({
    queryKey: [api.announcements.list.path],
    queryFn: async () => {
      const res = await fetch(api.announcements.list.path);
      if (!res.ok) throw new Error("Failed to fetch announcements");
      return await res.json();
    },
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertAnnouncement) => {
      console.log("Creating announcement with data:", data);
      const res = await fetch(api.announcements.create.path, {
        method: api.announcements.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.text();
        console.error("Announcement creation error:", res.status, error);
        throw new Error(`Failed to create announcement: ${res.status}`);
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.announcements.list.path] });
      toast({ title: "Published", description: "Announcement posted successfully" });
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast({ title: "Error", description: error.message || "Failed to post announcement", variant: "destructive" });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.announcements.delete.path, { id });
      const res = await fetch(url, { method: api.announcements.delete.method });
      if (!res.ok) throw new Error("Failed to delete announcement");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.announcements.list.path] });
      toast({ title: "Success", description: "Announcement deleted" });
    },
  });
}

// ATTENDANCE
export function useAttendance() {
  return useQuery({
    queryKey: [api.attendance.list.path],
    queryFn: async () => {
      const res = await fetch(api.attendance.list.path);
      if (!res.ok) throw new Error("Failed to fetch attendance");
      return await res.json();
    },
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertAttendance) => {
      const res = await fetch(api.attendance.mark.path, {
        method: api.attendance.mark.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to mark attendance");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.attendance.list.path] });
      toast({ title: "Marked", description: "Attendance recorded" });
    },
  });
}

// ADMIN USERS
export function useAdminUsers() {
  return useQuery({
    queryKey: [api.admin.users.path],
    queryFn: async () => {
      const res = await fetch(api.admin.users.path);
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json();
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.admin.deleteUser.path, { id });
      const res = await fetch(url, { method: api.admin.deleteUser.method });
      if (!res.ok) throw new Error("Failed to delete user");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.users.path] });
      toast({ title: "Success", description: "User deleted" });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: { id: number; updates: any }) => {
      const url = buildUrl(api.admin.updateUser.path, { id: data.id });
      const res = await fetch(url, {
        method: api.admin.updateUser.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.updates),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.users.path] });
      toast({ title: "Success", description: "Profile updated" });
    },
  });
}

export function useVerifyUser() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.admin.verifyUser.path, { id });
      const res = await fetch(url, { method: api.admin.verifyUser.method });
      if (!res.ok) throw new Error("Failed to verify user");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.users.path] });
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
      toast({ title: "Success", description: "Student verified" });
    },
  });
}

// CONTACT
export function useContact() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertContact) => {
      const res = await fetch(api.contact.create.path, {
        method: api.contact.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "Sent", description: "We received your message and will reply soon!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not send message. Please try again.", variant: "destructive" });
    },
  });
}

// CHANGE PASSWORD
export function useChangePassword() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const res = await fetch(api.auth.changePassword.path, {
        method: api.auth.changePassword.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to change password");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Password changed successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
